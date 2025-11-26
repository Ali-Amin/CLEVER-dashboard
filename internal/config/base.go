package config

type GatewayConfig struct {
	Server      API               `json:"server,omitempty"`
	DCF         DCFConfig         `json:"dcf,omitempty"`
	DLT         DLTConfig         `json:"dlt,omitempty"`
	DKG         DKGConfig         `json:"dkg,omitempty"`
	Forecasting ForecastingConfig `json:"forecasting,omitempty"`
}
