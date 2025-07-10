package middleware

import "github.com/danielgtaylor/huma/v2"

func AuthnMiddleware(ctx huma.Context, next func(huma.Context)) {
	// TODO
	next(ctx)
}
