package gateway

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"sync"
	"time"

	"clever.eu/dashboard/internal/dkg"
	"clever.eu/dashboard/internal/forecasting"
	"clever.eu/dashboard/internal/scheduling"
	"clever.eu/dashboard/pkg/interfaces"
	"github.com/coder/websocket"
	"github.com/coder/websocket/wsjson"
	"github.com/go-chi/chi"
)

type Router struct {
	Mux    *chi.Mux
	logger *slog.Logger
}

func newRouter(
	logger *slog.Logger,
	dlt interfaces.DLTClient,
	dcf interfaces.DCFClient,
	dkg *dkg.CleverDKGClient,
	forecaster *forecasting.Forecasting,
	scheduling *scheduling.SchedulingListener,
) *chi.Mux {
	router := &Router{
		Mux:    chi.NewRouter(),
		logger: logger,
	}

	router.Mux.Get("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c, err := websocket.Accept(
			w,
			r,
			&websocket.AcceptOptions{
				OriginPatterns: []string{"localhost:5173", "0.0.0.0:30080", "172.19.205.208:30080"},
			},
		)
		if err != nil {
			router.logger.Error(err.Error())
		}

		defer c.CloseNow()

		ctx, cancel := context.WithCancel(context.Background())
		defer cancel()
		wg := &sync.WaitGroup{}

		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				_, _, err := c.Read(ctx)
				if err != nil {
					return
				}
			}
		}()

		wg.Add(1)
		go func() {
			ticker := time.NewTicker(time.Second * 2)
			defer wg.Done()
			for {
				select {
				case <-ctx.Done():
					router.logger.Info("Client disconnected")
					return
				case <-ticker.C:
					dltMessages, err := dlt.GetMessages()
					if err != nil {
						router.logger.Error(err.Error())
						continue
					}
					infra, err := dkg.GetInfrastructure()
					if err != nil {
						router.logger.Error(err.Error())
						continue
					}

					for cluster, servers := range infra {
						for i, server := range servers {
							confidence, err := dcf.GetDeviceConfidence(server.Name)
							if err != nil {
								router.logger.Error(err.Error())
								continue
							}
							server.Confidence = confidence
							infra[cluster][i] = server

						}
					}

					cpu := forecaster.GetReadings()
					scheduling := scheduling.GetLogs()
					logger.Debug(fmt.Sprintf("%v", scheduling))

					data := map[string]interface{}{
						"dlt":        dltMessages,
						"infra":      infra,
						"forecast":   cpu,
						"scheduling": scheduling,
					}
					err = wsjson.Write(ctx, c, data)
					if err != nil {
						router.logger.Error(err.Error())
						return
					}
				}
			}
		}()
		wg.Wait()
		router.logger.Info("Closing connection...")
		c.Close(websocket.StatusNormalClosure, "")
	}))
	return router.Mux
}
