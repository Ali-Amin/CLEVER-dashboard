package consumers

import (
	"context"
	"fmt"
	"log/slog"
	"sync"
	"time"

	"clever.eu/dashboard/internal/config"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

type K8sSchedulingEventListener struct {
	clients map[string]*kubernetes.Clientset
	logger  *slog.Logger
	cfg     config.K8sEventListenerConfig
}

func NewK8sSchedulingEventListener(
	cfg config.K8sEventListenerConfig,
	logger *slog.Logger,
) (*K8sSchedulingEventListener, error) {
	clients := map[string]*kubernetes.Clientset{}
	for clusterName, configPath := range cfg.Kubeconfigs {
		k8sCFG, err := clientcmd.BuildConfigFromFlags("", configPath)
		if err != nil {
			return nil, err
		}
		client, err := kubernetes.NewForConfig(k8sCFG)
		if err != nil {
			return nil, err
		}
		clients[clusterName] = client
	}
	return &K8sSchedulingEventListener{
		clients: clients,
		cfg:     cfg,
		logger:  logger,
	}, nil
}

func (s *K8sSchedulingEventListener) SubscribeToScheduling(
	ctx context.Context,
	onMessage func(cluster, object, message string),
) error {
	watchers := map[string]watch.Interface{}
	for cluster, client := range s.clients {
		events, err := client.CoreV1().
			Events("default").
			Watch(ctx, metav1.ListOptions{})
		if err != nil {
			s.logger.Error(err.Error())
			return err
		}
		watchers[cluster] = events
	}

	wg := &sync.WaitGroup{}
	for cluster, watcher := range watchers {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for {
				select {
				case event, ok := <-watcher.ResultChan():
					if !ok {
						s.logger.Info("Restarting K8s listener due to hangup")
						continue
					}
					switch e := event.Object.(type) {
					case *corev1.Event:
						if e.Reason == "Scheduled" {
							onMessage(
								cluster,
								e.InvolvedObject.Name,
								fmt.Sprintf("%s: %s", time.Now().UTC(), e.Message),
							)
						} else if e.Reason == "Killing" {
							onMessage(cluster, e.InvolvedObject.Name, "")
						}
					}
				case <-time.After(30 * time.Minute):
					s.logger.Info("Restarting K8s listener due to timeout")
					continue
				}
			}
		}()
	}
	wg.Wait()
	return nil
}
