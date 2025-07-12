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
		CompilerOutput string `json:"message" doc:"Output from the compiler"`
		Hex            string `json:"hex" doc:"The compiled intel hex file"`
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

		ihex, err := os.ReadFile(jobResult.HexPath)

		// Cleanup
		os.Remove(jobResult.NewSourcePath)
		os.Remove(jobResult.HexPath)
		os.Remove(jobResult.HexPath[:len(jobResult.HexPath)-4] + ".eep.hex")
		os.Remove(jobResult.HexPath[:len(jobResult.HexPath)-4] + ".obj")

		if err != nil {
			return nil, fmt.Errorf("failed to read file: %w", err)
		}

		resp := &CompileOutput{}
		resp.Body.CompilerOutput = jobResult.CompilerOutput
		resp.Body.Hex = string(ihex)

		return resp, nil
	})

	return nil
}
