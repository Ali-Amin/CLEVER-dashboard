package consumers

import (
	"context"
	"encoding/json"
	"log/slog"
	"math"
	"time"

	"clever.eu/dashboard/internal/config"
	"clever.eu/dashboard/pkg/contracts"
	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
)

type KafkaConsumer struct {
	cfg    config.KafkaConsumerConfig
	logger *slog.Logger
}

func NewKafkaConsumer(cfg config.KafkaConsumerConfig, logger *slog.Logger) *KafkaConsumer {
	return &KafkaConsumer{cfg: cfg, logger: logger}
}

func (k *KafkaConsumer) SubscribeToForecasts(
	ctx context.Context,
	onNewMessage func(contracts.Forecast),
) error {
	c, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": k.cfg.BootstrapServer,
		"group.id":          k.cfg.GroupID,
	})
	if err != nil {
		return err
	}

	err = c.SubscribeTopics(k.cfg.Topics, nil)
	if err != nil {
		return err
	}

	for {
		msg, err := c.ReadMessage(10 * time.Second)

		if err != nil {
			k.logger.Error(err.Error())
		} else {
			var forecast contracts.Forecast
			err = json.Unmarshal(msg.Value, &forecast)
			t, err := time.Parse("2006-01-02T15:04:05.999999", forecast.ForecastTimestamp)
			if err != nil {
				k.logger.Error(err.Error())
				continue
			}
			t = t.Truncate(time.Second)
			forecast.ForecastTimestamp = t.Format("2006-01-02T15:04:05")
			forecast.Timestamp = t.Add(time.Second * -15).Format("2006-01-02T15:04:05")
			forecast.ActualCPU = forecast.ActualCPU / 1000000
			forecast.PredictedCPU = math.Abs(forecast.PredictedCPU / 1000000)
			onNewMessage(forecast)
		}
	}
}
