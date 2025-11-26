package contracts

type (
	DLTConfigType string
	DCFConfigType string
)

const HederaConfigType DLTConfigType = "hedera"

const AlvariumConfigType DCFConfigType = "alvarium"

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
