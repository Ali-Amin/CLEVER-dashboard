package dkg

import (
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"

	"clever.eu/dashboard/internal/config"
	"clever.eu/dashboard/pkg/contracts"
)

type CleverDKGClient struct {
	cfg    config.DKGConfig
	logger *slog.Logger
}

func NewCleverDKGClient(cfg config.DKGConfig, logger *slog.Logger) *CleverDKGClient {
	return &CleverDKGClient{cfg: cfg, logger: logger}
}

func (c *CleverDKGClient) GetInfrastructure() (contracts.Infrastructure, error) {
	response, err := http.Get(fmt.Sprintf("%s/clusters", c.cfg.API.GetURL()))
	if err != nil {

		c.logger.Error(err.Error())
		return nil, err
	}

	body, _ := io.ReadAll(response.Body)

	var clusters []struct {
		ID string `json:"id,omitempty"`
	}
	err = json.Unmarshal(body, &clusters)
	if err != nil {

		c.logger.Error(err.Error())
		return nil, err
	}

	infra := contracts.Infrastructure{}
	for _, cluster := range clusters {
		servers, err := c.getServers(cluster.ID)
		if err != nil {

			c.logger.Error(err.Error())
			return nil, err
		}
		infra[cluster.ID] = servers
	}

	fmt.Printf("%+v", infra)
	return infra, nil
}

func (c *CleverDKGClient) getServers(cluster string) ([]contracts.Server, error) {
	response, err := http.Get(fmt.Sprintf("%s/clusters/%s/nodes", c.cfg.API.GetURL(), cluster))
	if err != nil {

		c.logger.Error(err.Error())
		return nil, err
	}

	body, _ := io.ReadAll(response.Body)

	servers := []contracts.Server{}
	err = json.Unmarshal(body, &servers)
	if err != nil {

		c.logger.Error(err.Error())
		return nil, err
	}

	for i, server := range servers {
		pods, err := c.getPods(cluster, server.ID)
		if err != nil {
			c.logger.Error(err.Error())
			return nil, err
		}
		servers[i].Pods = pods
	}

	return servers, nil
}

func (c *CleverDKGClient) getPods(cluster string, serverID string) ([]string, error) {
	response, err := http.Get(
		fmt.Sprintf("%s/clusters/%s/%s/pods", c.cfg.API.GetURL(), cluster, serverID),
	)
	if err != nil {

		c.logger.Error(err.Error())
		return nil, err
	}

	if response.StatusCode == http.StatusNotFound {
		return []string{}, nil
	}

	body, _ := io.ReadAll(response.Body)

	var pods []struct {
		Name string `json:"name,omitempty"`
	}
	err = json.Unmarshal(body, &pods)
	if err != nil {
		c.logger.Error(err.Error())
		return nil, err
	}

	podNames := []string{}
	for _, p := range pods {
		podNames = append(podNames, p.Name)
	}

	return podNames, nil
}
