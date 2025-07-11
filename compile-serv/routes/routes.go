package routes

import (
	"errors"

	"github.com/danielgtaylor/huma/v2"
	"github.com/slightlyepic/sakura/compile-serv/routes/handlers"
	"github.com/slightlyepic/sakura/compile-serv/storage"
)

func AddRoutes(
	api huma.API,
	s storage.StorageClient,
) error {
	var err error = nil

	err = errors.Join(err, handlers.AddHealthzRoute(api))
	err = errors.Join(err, handlers.AddCompileRoute(api, s))

	return err
}
