package config

import (
	"encoding/json"
	"fmt"

	"clever.eu/dashboard/pkg/contracts"
)

type DLTConfig struct {
	Type   contracts.DLTConfigType `json:"type,omitempty"`
	Config any                     `json:"config,omitempty"`
}

type HederaConfig struct {
	Mirror API      `json:"mirror,omitempty"`
	Topics []string `json:"topics,omitempty"`
}

func (c *DLTConfig) UnmarshalJSON(data []byte) error {
	type alias struct {
		Type contracts.DLTConfigType `json:"type,omitempty"`
	}

	a := alias{}
	err := json.Unmarshal(data, &a)
	if err != nil {
		return err
	}

	switch a.Type {
	case contracts.HederaConfigType:
		type hederaAlias struct {
			Type   contracts.DLTConfigType `json:"type,omitempty"`
			Config HederaConfig            `json:"config,omitempty"`
		}

		h := hederaAlias{}
		err := json.Unmarshal(data, &h)
		if err != nil {
			return err
		}

		c.Type = h.Type
		c.Config = h.Config
	default:
		return fmt.Errorf("unknown DLT config type: %s", a.Type)
	}
	return nil
}
