package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/slightlyepic/sakura/compile-serv/routes"
	"github.com/slightlyepic/sakura/compile-serv/routes/middleware"

	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humago"
	"github.com/danielgtaylor/huma/v2/humacli"
)

type CliOptions struct {
	Debug bool   `doc:"Enable debug logging" default:"false"`
	Host  string `doc:"Hostname to listen on." default:"127.0.0.1"`
	Port  int    `doc:"Port to listen on." short:"p" default:"8080"`
}

func main() {
	run(os.Stdout, os.Stderr)
}

func run(stdout, stderr io.Writer) {
	cli := humacli.New(func(hooks humacli.Hooks, options *CliOptions) {
		fmt.Fprintf(stdout, "CLI Options%+v\n", *options)

		mux, _ := NewServer()
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

func NewServer() (*http.ServeMux, huma.API) {
	mux := http.NewServeMux()
	api := humago.New(mux, huma.DefaultConfig("Compile Service", "0.1.0"))

	api.UseMiddleware(middleware.AuthnMiddleware)
	routes.AddRoutes(api)

	return mux, api
}
