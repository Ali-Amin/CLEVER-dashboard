package factories

import (
	"fmt"
	"log/slog"

	"clever.eu/dashboard/internal/config"
	"clever.eu/dashboard/internal/dlt"
	"clever.eu/dashboard/pkg/contracts"
	"clever.eu/dashboard/pkg/interfaces"
)

func NewDLTClient(cfg config.DLTConfig, logger *slog.Logger) (interfaces.DLTClient, error) {
	switch cfg.Type {
	case contracts.HederaConfigType:
		config, ok := cfg.Config.(config.HederaConfig)
		if !ok {
			return nil, fmt.Errorf("bad hedera config")
		}
		return dlt.NewHederaConsensusDLTClient(config, logger), nil
	}
	return nil, fmt.Errorf("unknown dlt config: %s", cfg.Type)
}
