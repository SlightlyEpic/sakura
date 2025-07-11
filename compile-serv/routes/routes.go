package routes

import (
	"errors"

	"github.com/danielgtaylor/huma/v2"
	compilepooler "github.com/slightlyepic/sakura/compile-serv/compile_pooler"
	"github.com/slightlyepic/sakura/compile-serv/routes/handlers"
	"github.com/slightlyepic/sakura/compile-serv/storage"
)

func AddRoutes(
	api huma.API,
	s storage.StorageClient,
	p *compilepooler.CompilePool,
) error {
	var err error = nil

	err = errors.Join(err, handlers.AddHealthzRoute(api))
	err = errors.Join(err, handlers.AddCompileRoute(api, s, p))

	return err
}
