package routes

import (
	"errors"

	"github.com/danielgtaylor/huma/v2"
	"github.com/slightlyepic/sakura/compile-serv/routes/handlers"
)

func AddRoutes(api huma.API) error {
	var err error = nil

	err = errors.Join(err, handlers.AddHealthzRoute(api))

	return err
}
