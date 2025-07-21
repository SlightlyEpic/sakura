package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/rs/cors"
	compilepooler "github.com/slightlyepic/sakura/compile-serv/compile_pooler"
	"github.com/slightlyepic/sakura/compile-serv/routes"
	"github.com/slightlyepic/sakura/compile-serv/routes/middleware"
	"github.com/slightlyepic/sakura/compile-serv/storage"
	"github.com/slightlyepic/sakura/compile-serv/util"
	_ "github.com/slightlyepic/sakura/compile-serv/yffi"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humago"
	"github.com/danielgtaylor/huma/v2/humacli"
)

func main() {
	run(os.Stdout, os.Stderr)
}

func run(stdout, stderr io.Writer) {
	cli := humacli.New(func(hooks humacli.Hooks, options *util.CliOptions) {
		if problems := options.Validate(); len(problems) > 0 {
			fmt.Fprintf(stderr, "error while validating options:\n")
			for k, v := range problems {
				fmt.Fprintf(stderr, "- %s: %s\n", k, v)
			}

			os.Exit(1)
		}
		fmt.Fprintf(stdout, "CLI Options%s\n", options.String())

		// * Storage Client
		storageClient, err := storage.NewClient(options.S3EndpointUrl, options.S3AccessKeyId, options.S3SecretAccessKey)
		if err != nil {
			fmt.Fprintf(stderr, "%s", err)
			os.Exit(1)
		}

		// * Compile Pool
		const compilePoolWorkers = 1
		const compilePoolQueueSize = 5 * compilePoolWorkers
		compilePool := compilepooler.NewCompilePool(compilePoolWorkers, compilePoolQueueSize)
		compilePool.Start()

		mux, _, err := NewServer(storageClient, compilePool)
		if err != nil {
			fmt.Fprintf(stderr, "%s", err)
			os.Exit(1)
		}

		srv := &http.Server{
			Addr:    fmt.Sprintf("%s:%d", options.Host, options.Port),
			Handler: mux,
		}

		hooks.OnStart(func() {
			fmt.Fprintf(stdout, "listening on %s\n", srv.Addr)
			if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
				fmt.Fprintf(stderr, "error listening and serving: %s\n", err)
			}
		})

		hooks.OnStop(func() {
			shutdownCtx := context.Background()
			shutdownCtx, cancel := context.WithTimeout(shutdownCtx, 10*time.Second)
			defer cancel()
			if err := srv.Shutdown(shutdownCtx); err != nil && err != http.ErrServerClosed {
				fmt.Fprintf(stderr, "error shutting down http server: %s\n", err)
			}
		})
	})

	cli.Run()
}

func NewServer(
	s storage.StorageClient,
	p *compilepooler.CompilePool,
	// ) (*http.ServeMux, huma.API, error) {
) (http.Handler, huma.API, error) {
	mux := http.NewServeMux()

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
		Debug:            false,
	})
	handler := c.Handler(mux)

	api := humago.New(mux, huma.DefaultConfig("Compile Service", "0.1.0"))
	api.UseMiddleware(middleware.AuthnMiddleware)

	err := routes.AddRoutes(api, s, p)
	if err != nil {
		return nil, nil, err
	}

	return handler, api, nil
}
