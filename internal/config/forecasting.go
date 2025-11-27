package config

type ForecastingConfig struct {
	Listener ConsumerConfig `json:"stream,omitempty"`
}
