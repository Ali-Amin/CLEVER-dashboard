package config

import (
	"encoding/json"
	"fmt"

	"clever.eu/dashboard/pkg/contracts"
)

type DCFConfig struct {
	Type   contracts.DCFConfigType `json:"type,omitempty"`
	Config any                     `json:"config,omitempty"`
}

type AlvariumConfig struct {
	API API `json:"api,omitempty"`
}

func (c *DCFConfig) UnmarshalJSON(data []byte) error {
	type alias struct {
		Type contracts.DCFConfigType `json:"type,omitempty"`
	}

	var a alias
	err := json.Unmarshal(data, &a)
	if err != nil {
		return err
	}

	switch a.Type {
	case contracts.AlvariumConfigType:
		type alvariumAlias struct {
			Type   contracts.DCFConfigType `json:"type,omitempty"`
			Config AlvariumConfig          `json:"config,omitempty"`
		}

		var a alvariumAlias
		err := json.Unmarshal(data, &a)
		if err != nil {
			return err
		}

		c.Type = a.Type
		c.Config = a.Config
	default:
		return fmt.Errorf("unknown dcf type found in config: %s", a.Type)
	}
	return nil
}
