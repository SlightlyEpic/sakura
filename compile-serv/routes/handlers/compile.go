package handlers

import (
	"context"
	"fmt"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
	"github.com/slightlyepic/sakura/compile-serv/storage"
)

type CompileInput struct {
	Body struct {
		ObjectName string `json:"objectName" doc:"The object name of the file in the bucket" minLength:"1"`
	}
}
type CompileOutput struct {
	Body struct {
		Message   string `json:"message" doc:"Compile status"`
		OutBinary []byte `json:"outBinary" doc:"The compiled binary"`
	}
}

func AddCompileRoute(api huma.API, s storage.StorageClient) error {
	huma.Register(api, huma.Operation{
		OperationID: "compile",
		Method:      http.MethodPost,
		Path:        "/compile",
		Summary:     "Compile a project",
	}, func(ctx context.Context, i *CompileInput) (*CompileOutput, error) {
		// No need for a goroutine here because huma creates a goroutine per request
		localPath, err := s.PullFileToLocal(ctx, i.Body.ObjectName)
		if err != nil {
			return nil, err
		}

		resp := &CompileOutput{}
		resp.Body.Message = fmt.Sprintf("Success: %s", localPath)
		resp.Body.OutBinary = []byte{}

		return resp, nil
	})

	return nil
}
