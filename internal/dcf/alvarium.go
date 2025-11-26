package dcf

import (
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"

	"clever.eu/dashboard/internal/config"
)

type AlvariumDCFClient struct {
	cfg    config.AlvariumConfig
	logger *slog.Logger
}

func NewAlvariumDCFClient(cfg config.AlvariumConfig, logger *slog.Logger) *AlvariumDCFClient {
	return &AlvariumDCFClient{cfg: cfg, logger: logger}
}

func (c *AlvariumDCFClient) GetDeviceConfidence(deviceName string) (int, error) {
	response, err := http.Get(fmt.Sprintf("%s/hosts/%s/confidence", c.cfg.API.GetURL(), deviceName))
	if err != nil {
		c.logger.Error(err.Error())
		return 0, err
	}

	body, _ := io.ReadAll(response.Body)

	var result struct {
		Confidence float64 `json:"confidence,omitempty"`
	}
	err = json.Unmarshal(body, &result)
	if err != nil {
		c.logger.Error(err.Error())
		return 0, err
	}

	return int(result.Confidence * 100), nil
}
