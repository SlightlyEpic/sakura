package compilepooler

import "sync"

type CompileJob struct {
	SourcePath string
	Result     chan *CompileJobResult
}

// BinaryPath is set if no error
type CompileJobResult struct {
	Error      error
	BinaryPath string
}

type CompilePool struct {
	sync.Mutex
	IsInit     bool
	workers    int
	jobQueue   chan CompileJob
	shutdown   chan struct{}
	shutdownWg sync.WaitGroup
}

func NewCompilePool(workers, queueSize int) *CompilePool {
	pool := &CompilePool{
		IsInit:     false,
		workers:    workers,
		jobQueue:   make(chan CompileJob, queueSize),
		shutdown:   make(chan struct{}, workers),
		shutdownWg: sync.WaitGroup{},
	}
	pool.shutdownWg.Add(workers)
	return pool
}

func (p *CompilePool) Start() {
	p.Lock()
	for range p.workers {
		go compileWorker(p)
	}
	p.IsInit = true
	p.Unlock()
}

func (p *CompilePool) Close() {
	p.Lock()
	if !p.IsInit {
		return
	}

	// Signal all workers to shut down
	for range p.workers {
		p.shutdown <- struct{}{}
	}

	// Wait till all workers shut down
	p.shutdownWg.Wait()
	p.Unlock()
}

func (p *CompilePool) AddJob(job CompileJob) {
	p.jobQueue <- job
}
