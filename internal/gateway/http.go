package gateway

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"sync"

	"clever.eu/dashboard/internal/config"
	"clever.eu/dashboard/internal/dkg"
	"clever.eu/dashboard/pkg/interfaces"
)

type GatewayHTTPServer struct {
	cfg    config.GatewayConfig
	logger *slog.Logger
	dlt    interfaces.DLTClient
	dcf    interfaces.DCFClient
	dkg    *dkg.CleverDKGClient
}

func NewGatewayHTTPServer(
	cfg config.GatewayConfig,
	logger *slog.Logger,
	dlt interfaces.DLTClient,
	dcf interfaces.DCFClient,
	dkg *dkg.CleverDKGClient,
) *GatewayHTTPServer {
	return &GatewayHTTPServer{cfg: cfg, logger: logger, dlt: dlt, dcf: dcf, dkg: dkg}
}

func (s *GatewayHTTPServer) Bootstrap(ctx context.Context, wg *sync.WaitGroup) bool {
	s.logger.Info(fmt.Sprintf("Onboarding server running on %s", s.cfg.Server.GetURL()))

	server := &http.Server{
		Addr:    fmt.Sprintf("%s:%d", s.cfg.Server.Host, s.cfg.Server.Port),
		Handler: newRouter(s.logger, s.dlt, s.dcf, s.dkg),
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		err := server.ListenAndServe()
		if err != nil {
			s.logger.Error(err.Error())
		}
	}()

	wg.Add(1)
	go func() {
		<-ctx.Done()
		err := server.Close()
		if err != nil {
			s.logger.Error(err.Error())
		}
		s.logger.Info("Shutdown received for gateway server")
	}()

	return true
}
