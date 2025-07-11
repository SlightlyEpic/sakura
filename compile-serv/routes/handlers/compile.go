package handlers

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/danielgtaylor/huma/v2"
	compilepooler "github.com/slightlyepic/sakura/compile-serv/compile_pooler"
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

func AddCompileRoute(
	api huma.API,
	s storage.StorageClient,
	p *compilepooler.CompilePool,
) error {
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

		job := compilepooler.CompileJob{
			SourcePath: localPath,
			Result:     make(chan *compilepooler.CompileJobResult),
		}
		p.AddJob(job)
		jobResult := <-job.Result
		if jobResult.Error != nil {
			return nil, jobResult.Error
		}

		binData, err := os.ReadFile(jobResult.BinaryPath)
		if err != nil {
			return nil, fmt.Errorf("failed to read file: %w", err)
		}

		resp := &CompileOutput{}
		resp.Body.Message = "Success"
		resp.Body.OutBinary = binData

		return resp, nil
	})

	return nil
}
