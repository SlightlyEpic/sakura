package compilepooler

import "fmt"

func compileWorker(p *CompilePool) {
	for {
		select {
		case <-p.shutdown:
			return
		case job := <-p.jobQueue:
			fmt.Printf("compile job source path: %s\n", job.SourcePath)
			// TODO: call avr-gcc
			result := &CompileJobResult{
				Error:      fmt.Errorf("not implemented"),
				BinaryPath: "",
			}
			job.Result <- result
		}
	}
}
