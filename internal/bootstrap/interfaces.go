package bootstrap

import (
	"context"
	"sync"
)

type BootstrapHandler func(
	ctx context.Context,
	wg *sync.WaitGroup,
) (success bool)
