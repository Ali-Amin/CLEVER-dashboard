package factories

import (
	"fmt"
	"log/slog"

	"clever.eu/dashboard/internal/config"
	"clever.eu/dashboard/internal/dcf"
	"clever.eu/dashboard/pkg/contracts"
	"clever.eu/dashboard/pkg/interfaces"
)

func NewDCFClient(cfg config.DCFConfig, logger *slog.Logger) (interfaces.DCFClient, error) {
	switch cfg.Type {
	case contracts.AlvariumConfigType:
		config, ok := cfg.Config.(config.AlvariumConfig)
		if !ok {
			return nil, fmt.Errorf("bad alvarium config")
		}
		return dcf.NewAlvariumDCFClient(config, logger), nil
	}
	return nil, fmt.Errorf("unknown dcf type: %s", cfg.Type)
}
