package config

import "fmt"

type API struct {
	Host     string `json:"host,omitempty"`
	Protocol string `json:"protocol,omitempty"`
	Port     int    `json:"port,omitempty"`
}

func (a *API) GetURL() string {
	return fmt.Sprintf("%s://%s:%d", a.Protocol, a.Host, a.Port)
}
