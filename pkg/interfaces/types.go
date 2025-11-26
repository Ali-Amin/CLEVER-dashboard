package interfaces

type DCFClient interface {
	GetDeviceConfidence(deviceName string) (int, error)
}

type DLTClient interface {
	GetMessages() ([]string, error)
}
