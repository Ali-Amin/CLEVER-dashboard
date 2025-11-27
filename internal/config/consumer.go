package config

import (
	"encoding/json"
	"fmt"

	"clever.eu/dashboard/pkg/contracts"
)

type ConsumerConfig struct {
	Type   contracts.ConsumerType `json:"tpye,omitempty"`
	Config any                    `json:"config,omitempty"`
}

type KafkaConsumerConfig struct {
	BootstrapServer string   `json:"bootstrap,omitempty"`
	GroupID         string   `json:"groupId,omitempty"`
	Topics          []string `json:"topics,omitmpety"`
}

type K8sEventListenerConfig struct {
	Kubeconfigs map[string]string `json:"kubeconfigs,omitempty"`
}

func (c *ConsumerConfig) UnmarshalJSON(data []byte) error {
	var alias struct {
		Type contracts.ConsumerType `json:"type,omitempty"`
	}

	err := json.Unmarshal(data, &alias)
	if err != nil {
		return err
	}

	switch alias.Type {
	case contracts.KafkaStream:
		var kafkaAlias struct {
			Type   contracts.ConsumerType `json:"type,omitempty"`
			Config KafkaConsumerConfig    `json:"config,omitempty"`
		}
		err := json.Unmarshal(data, &kafkaAlias)
		if err != nil {
			return err
		}
		c.Type = kafkaAlias.Type
		c.Config = kafkaAlias.Config
	case contracts.K8sConsumer:
		var k8sAlias struct {
			Type   contracts.ConsumerType `json:"type,omitempty"`
			Config K8sEventListenerConfig `json:"config,omitempty"`
		}
		err = json.Unmarshal(data, &k8sAlias)
		if err != nil {
			return err
		}
		c.Type = k8sAlias.Type
		c.Config = k8sAlias.Config
	default:
		return fmt.Errorf("unknown forecasting stream type: %s", alias.Type)
	}
	return nil
}
