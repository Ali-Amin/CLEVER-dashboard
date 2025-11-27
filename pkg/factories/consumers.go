package factories

import (
	"fmt"
	"log/slog"

	"clever.eu/dashboard/internal/config"
	"clever.eu/dashboard/internal/consumers"
	"clever.eu/dashboard/pkg/contracts"
	"clever.eu/dashboard/pkg/interfaces"
)

func NewForecastConsumer(
	cfg config.ConsumerConfig,
	logger *slog.Logger,
) (interfaces.ForecastConsumer, error) {
	switch cfg.Type {
	case contracts.KafkaStream:
		c, ok := cfg.Config.(config.KafkaConsumerConfig)
		if !ok {
			return nil, fmt.Errorf("invalid kafka config")
		}
		return consumers.NewKafkaConsumer(c, logger), nil
	default:
		return nil, fmt.Errorf("unknown consumer type: %s", cfg.Type)
	}
}

func NewSchedulingConsumer(
	cfg config.ConsumerConfig,
	logger *slog.Logger,
) (interfaces.SchedulingConsumer, error) {
	switch cfg.Type {
	case contracts.K8sConsumer:
		c, ok := cfg.Config.(config.K8sEventListenerConfig)
		if !ok {
			return nil, fmt.Errorf("invalid k8s listener config")
		}
		return consumers.NewK8sSchedulingEventListener(c, logger)
	default:
		return nil, fmt.Errorf("unknown consumer type: %s", cfg.Type)
	}
}
