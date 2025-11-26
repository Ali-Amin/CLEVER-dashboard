package contracts

type (
	DLTConfigType string
	DCFConfigType string
	StreamType    string
)

const HederaConfigType DLTConfigType = "hedera"

const (
	AlvariumConfigType DCFConfigType = "alvarium"
	KafkaStream        StreamType    = "kafka"
)

type Server struct {
	Name              string   `json:"hostname,omitempty"`
	ID                string   `json:"id,omitempty"`
	Pods              []string `json:"pods,omitempty"`
	AllocatableCPU    string   `json:"allocatable_cpu,omitempty"`
	AllocatableMemory string   `json:"allocatable_memory,omitempty"`
	InternalIP        string   `json:"internalIP,omitempty"`
	UsageCPU          int      `json:"usage_cpu,omitempty"`
	UsageMemory       int      `json:"usage_memory,omitempty"`
	Confidence        int      `json:"confidence,omitempty"`
}

type Infrastructure map[string][]Server

type Forecast struct {
	Pod               string  `json:"pod_name,omitempty"`
	ForecastTimestamp string  `json:"forecast_timestamp,omitempty"`
	Timestamp         string  `json:"timestamp,omitempty"`
	PredictedCPU      float64 `json:"predicted_cpu_usage,omitempty"`
	ActualCPU         float64 `json:"actual_cpu_usage,omitempty"`
	Horizon           float64 `json:"target_horizon_sec,omitempty"`
}
