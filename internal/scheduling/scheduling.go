package scheduling

import (
	"context"
	"fmt"
	"log/slog"
	"sync"

	"clever.eu/dashboard/internal/config"
	"clever.eu/dashboard/pkg/factories"
)

type SchedulingListener struct {
	cfg    config.ConsumerConfig
	logger *slog.Logger

	mx   *sync.RWMutex
	logs []Log
}

type Log struct {
	Type    string `json:"type,omitempty"`
	Message string `json:"message,omitempty"`
}

func NewSchedulingListener(
	cfg config.ConsumerConfig,
	logger *slog.Logger,
) *SchedulingListener {
	return &SchedulingListener{
		cfg:    cfg,
		logger: logger,
		mx:     &sync.RWMutex{},
		logs:   []Log{},
	}
}

func (s *SchedulingListener) Bootstrap(ctx context.Context, wg *sync.WaitGroup) bool {
	consumer, err := factories.NewSchedulingConsumer(s.cfg, s.logger)
	if err != nil {
		s.logger.Error(err.Error())
		return false
	}
	wg.Add(1)
	go func() {
		defer wg.Done()
		err = consumer.SubscribeToScheduling(ctx, func(cluster, object, message string) {
			s.mx.Lock()
			s.logs = append(
				s.logs,
				Log{
					Type:    "global",
					Message: fmt.Sprintf("Workload '%s' scheduled on '%s'", object, cluster),
				},
				Log{
					Type:    "local",
					Message: message,
				},
			)

			s.mx.Unlock()
		})
		if err != nil {
			s.logger.Error(err.Error())
		}
	}()
	return true
}

func (s *SchedulingListener) GetLogs() []Log {
	s.mx.RLock()
	defer s.mx.RUnlock()
	return s.logs
}
