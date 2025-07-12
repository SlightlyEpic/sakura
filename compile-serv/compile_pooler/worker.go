package compilepooler

import (
	"os"
	"os/exec"
	"path"
	"path/filepath"
)

func compileWorker(p *CompilePool) {
	for {
		select {
		case <-p.shutdown:
			p.shutdownWg.Done()
			return
		case job := <-p.jobQueue:
			filename := filepath.Base(job.SourcePath)
			filenameNoExt := filename[:len(filename)-len(path.Ext(filename))]

			const includesDir = "/usr/local/share/avra/incldues"
			const compileDir = "/tmp/avra-out/"

			if err := os.MkdirAll(compileDir, 0755); err != nil {
				job.Result <- &CompileJobResult{
					Error:   err,
					HexPath: "",
				}
				break
			}

			// cmd := exec.Command("avr-gcc", "-mmcu=atmega328p", "-c", job.SourcePath, "-o", binPath)

			// avra doesn't really have a proper -o flag
			// it generates three files but only one of them is placed in -o's location
			// the other two are put wherever the source file is
			// so its better to move the source file to the directory where the output files are desired
			sourcePath := path.Join(compileDir, filename)
			os.Rename(job.SourcePath, sourcePath)
			cmd := exec.Command("avra", "-I", includesDir, sourcePath)

			hexPath := path.Join(compileDir, filenameNoExt+".hex")

			output, err := cmd.CombinedOutput()
			if len(output) > 0 {
				err = nil
			}

			job.Result <- &CompileJobResult{
				Error:          err,
				CompilerOutput: string(output),
				NewSourcePath:  sourcePath,
				HexPath:        hexPath,
			}
		}
	}
}
