package handlers

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
)

type HealthzInput struct{}
type HealthzOutput struct {
	Body struct {
		Message string `json:"message"`
	}
}

func AddHealthzRoute(api huma.API) error {
	huma.Register(api, huma.Operation{
		OperationID: "healthz",
		Method:      http.MethodGet,
		Path:        "/healthz",
		Summary:     "Health check",
	}, func(ctx context.Context, i *HealthzInput) (*HealthzOutput, error) {
		resp := &HealthzOutput{}
		resp.Body.Message = "Healthy"
		return resp, nil
	})

	return nil
}
