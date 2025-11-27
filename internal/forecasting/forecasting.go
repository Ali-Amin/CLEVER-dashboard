package forecasting

import (
	"log/slog"
	"sort"
	"sync"

	"clever.eu/dashboard/internal/config"
	"clever.eu/dashboard/pkg/contracts"
	"clever.eu/dashboard/pkg/factories"
	"golang.org/x/net/context"
)

type Forecasting struct {
	cfg    config.ForecastingConfig
	logger *slog.Logger

	mx   *sync.RWMutex
	data map[string]ValueStack
}

type ValueStack []Reading

type Reading struct {
	Timestamp     string  `json:"timestamp,omitempty"`
	ActualCPU     float64 `json:"actual_cpu,omitempty"`
	ForecastedCPU float64 `json:"forecasted_cpu,omitempty"`
}

func (s *ValueStack) Push(v Reading) {
	*s = append(*s, v)
}

func (s *ValueStack) Pop() {
	if len(*s) != 0 {
		*s = (*s)[1:]
	}
}

func NewForecasting(
	cfg config.ForecastingConfig,
	logger *slog.Logger,
) *Forecasting {
	return &Forecasting{
		cfg:    cfg,
		logger: logger,
		mx:     &sync.RWMutex{},
		data:   map[string]ValueStack{},
	}
}

func (f *Forecasting) Bootstrap(ctx context.Context, wg *sync.WaitGroup) bool {
	wg.Add(1)
	go func() {
		defer wg.Done()
		consumer, err := factories.NewForecastConsumer(f.cfg.Listener, f.logger)
		if err != nil {
			f.logger.Error(err.Error())
			return
		}

		// We subscribe to new messages that have the forecasted CPU value that is 60
		// seconds later than the actual CPU in the same message
		//
		// We will build 70 seconds of readings (i.e., 35 entries) since a new reading
		// is published every 2 seconds.
		//
		// At first, actual CPU and predicted CPU will not overlap until 60 seconds are reached:
		// P(T=60) - A(T=0) | {forecasted:,timestamp:60} - {actual:,timestamp:0}
		// P(T=62) - A(T=2) | {forecasted:,timestamp:62} - {actual:,timestamp:2}
		// ---
		// P(T=120) - A(T=60) | {forecasted:,timestamp:120} - {actual:,forecasted:,timestamp:60}
		err = consumer.SubscribeToForecasts(ctx, func(message contracts.Forecast) {
			podName := message.Pod
			data := f.data[podName]
			sort.Slice(data, func(i, j int) bool {
				return data[i].Timestamp < data[j].Timestamp
			})
			for len(data) > 70 {
				data.Pop()
			}

			data.Push(
				Reading{Timestamp: message.ForecastTimestamp, ForecastedCPU: message.PredictedCPU},
			)

			found := false
			for i, r := range data {
				if r.Timestamp == message.Timestamp {
					data[i].ActualCPU = message.ActualCPU
					found = true
				}
			}
			if !found {
				data.Push(Reading{Timestamp: message.Timestamp, ActualCPU: message.ActualCPU})
			}
			f.mx.Lock()
			f.data[podName] = data
			f.mx.Unlock()
		})
		if err != nil {
			f.logger.Error(err.Error())
		}
	}()
	return true
}

func (f *Forecasting) GetReadings() map[string]ValueStack {
	f.mx.RLock()
	defer f.mx.RUnlock()
	return f.data
}
