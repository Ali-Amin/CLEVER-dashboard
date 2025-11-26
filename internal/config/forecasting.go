package config

import (
	"encoding/json"
	"fmt"

	"clever.eu/dashboard/pkg/contracts"
)

type ForecastingConfig struct {
	Stream StreamConfig `json:"stream,omitempty"`
}

type StreamConfig struct {
	Type   contracts.StreamType `json:"tpye,omitempty"`
	Config any                  `json:"config,omitempty"`
}

type KafkaStreamConfig struct {
	BootstrapServer string   `json:"bootstrap,omitempty"`
	GroupID         string   `json:"groupId,omitempty"`
	Topics          []string `json:"topics,omitmpety"`
}

func (c *StreamConfig) UnmarshalJSON(data []byte) error {
	var alias struct {
		Type contracts.StreamType `json:"type,omitempty"`
	}

	err := json.Unmarshal(data, &alias)
	if err != nil {
		return err
	}

	switch alias.Type {
	case contracts.KafkaStream:
		var kafkaAlias struct {
			Type   contracts.StreamType `json:"type,omitempty"`
			Config KafkaStreamConfig    `json:"config,omitempty"`
		}
		err := json.Unmarshal(data, &kafkaAlias)
		if err != nil {
			return err
		}
		c.Type = kafkaAlias.Type
		c.Config = kafkaAlias.Config
	default:
		return fmt.Errorf("unknown forecasting stream type: %s", alias.Type)
	}
	return nil
}
