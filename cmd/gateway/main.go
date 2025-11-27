package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log/slog"
	"os"

	"clever.eu/dashboard/internal/bootstrap"
	"clever.eu/dashboard/internal/config"
	"clever.eu/dashboard/internal/dkg"
	"clever.eu/dashboard/internal/forecasting"
	"clever.eu/dashboard/internal/gateway"
	"clever.eu/dashboard/internal/scheduling"
	"clever.eu/dashboard/pkg/factories"
)

func main() {
	var configPath string
	flag.StringVar(&configPath, "cfg", "./cmd/gateway/res/config.json", "Path to JSON config file")
	flag.Parse()

	file, err := os.ReadFile(configPath)
	if err != nil {
		fmt.Printf("Error reading config: %s", err.Error())
		os.Exit(1)
	}

	var cfg config.GatewayConfig
	err = json.Unmarshal(file, &cfg)
	if err != nil {
		fmt.Printf("Error unmarshalling config: %s", err.Error())
		os.Exit(1)
	}

	logger := slog.New(
		slog.NewTextHandler(
			os.Stdout,
			&slog.HandlerOptions{
				AddSource: true,
				Level:     slog.LevelDebug,
			},
		),
	)

	logger.Info(fmt.Sprintf("Config loaded: %+v", cfg))

	dltClient, err := factories.NewDLTClient(cfg.DLT, logger)
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}

	dcfClient, err := factories.NewDCFClient(cfg.DCF, logger)
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}

	dkgClient := dkg.NewCleverDKGClient(cfg.DKG, logger)

	sch := scheduling.NewSchedulingListener(cfg.Scheduling, logger)
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}
	forecaster := forecasting.NewForecasting(cfg.Forecasting, logger)
	gw := gateway.NewGatewayHTTPServer(
		cfg,
		logger,
		dltClient,
		dcfClient,
		dkgClient,
		forecaster,
		sch,
	)

	ctx, cancel := context.WithCancel(context.Background())
	bootstrap.Run(ctx, cancel, []bootstrap.BootstrapHandler{
		sch.Bootstrap,
		forecaster.Bootstrap,
		gw.Bootstrap,
	})
}
