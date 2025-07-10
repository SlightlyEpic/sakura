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
	Debug             bool   `doc:"Enable debug logging" default:"false"`
	Host              string `doc:"Hostname to listen on." default:"127.0.0.1"`
	Port              int    `doc:"Port to listen on." short:"p" default:"4001"`
	S3EndpointUrl     string `doc:"S3 endpoint to fetch files from"`
	S3AccessKeyId     string `doc:"S3 access credentials"`
	S3SecretAccessKey string `doc:"S3 access credentials"`
}

func main() {
	run(os.Stdout, os.Stderr)
}

func run(stdout, stderr io.Writer) {
	cli := humacli.New(func(hooks humacli.Hooks, options *CliOptions) {
		if problems := options.Validate(); len(problems) > 0 {
			fmt.Fprintf(stderr, "error while validating options:\n")
			for k, v := range problems {
				fmt.Fprintf(stderr, "- %s: %s\n", k, v)
			}

			panic("error while validating options")
		}

		fmt.Fprintf(stdout, "CLI Options%s\n", options.String())

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

func (o *CliOptions) String() string {
	return fmt.Sprintf(
		"{Debug:%v Host:%s Port:%d S3EndpointUrl:%s S3AccessKeyId:*** S3SecretAccessKey:***}",
		o.Debug, o.Host, o.Port, o.S3EndpointUrl,
	)
}

func (o *CliOptions) Validate() map[string]string {
	problems := make(map[string]string)

	if len(o.S3EndpointUrl) == 0 {
		problems["S3EndpointUrl"] = "missing value"
	}
	if len(o.S3AccessKeyId) == 0 {
		problems["S3AccessKeyId"] = "missing value"
	}
	if len(o.S3SecretAccessKey) == 0 {
		problems["S3SecretAccessKey"] = "missing value"
	}

	return problems
}
