package interfaces

import (
	"context"

	"clever.eu/dashboard/pkg/contracts"
)

type DCFClient interface {
	GetDeviceConfidence(deviceName string) (int, error)
}

type DLTClient interface {
	GetMessages() ([]string, error)
}

type ForecastConsumer interface {
	SubscribeToForecasts(ctx context.Context, onMessage func(message contracts.Forecast)) error
}

type SchedulingConsumer interface {
	SubscribeToScheduling(
		ctx context.Context,
		onMessage func(cluster, object, message string),
	) error
}
