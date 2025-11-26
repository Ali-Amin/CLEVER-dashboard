package bootstrap

import (
	"context"
	"os"
	"os/signal"
	"sync"
	"syscall"
)

// Run is the bootstrap process entry point. All relevant application components can be initialized by providing a
// BootstrapHandler implementation to the handlers array.
func Run(
	ctx context.Context,
	cancel context.CancelFunc,
	handlers []BootstrapHandler,
) {
	wg, _ := initWaitGroup(ctx, cancel, handlers)

	wg.Wait()
}

func initWaitGroup(
	ctx context.Context,
	cancel context.CancelFunc,
	handlers []BootstrapHandler,
) (*sync.WaitGroup, bool) {
	startedSuccessfully := true

	var wg sync.WaitGroup
	// call individual bootstrap handlers.
	translateInterruptToCancel(ctx, &wg, cancel)
	for i := range handlers {
		if handlers[i](ctx, &wg) == false {
			cancel()
			startedSuccessfully = false
			break
		}
	}

	return &wg, startedSuccessfully
}

// translateInterruptToCancel spawns a go routine to translate the receipt of a SIGTERM signal to a call to cancel
// the context used by the bootstrap implementation.
func translateInterruptToCancel(
	ctx context.Context,
	wg *sync.WaitGroup,
	cancel context.CancelFunc,
) {
	wg.Add(1)
	go func() {
		defer wg.Done()

		signalStream := make(chan os.Signal, 1)
		defer func() {
			signal.Stop(signalStream)
			close(signalStream)
		}()
		signal.Notify(signalStream, os.Interrupt, syscall.SIGTERM)
		select {
		case <-signalStream:
			cancel()
			return
		case <-ctx.Done():
			os.Exit(0)
			return
		}
	}()
}
