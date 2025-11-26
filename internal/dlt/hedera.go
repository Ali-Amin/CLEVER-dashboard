package dlt

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"time"

	"clever.eu/dashboard/internal/config"
	hedera "github.com/hiero-ledger/hiero-sdk-go/v2/sdk"
)

type HederaConsensusDLTClient struct {
	cfg    config.HederaConfig
	logger *slog.Logger
	client *hedera.Client
}

func NewHederaConsensusDLTClient(
	cfg config.HederaConfig,
	logger *slog.Logger,
) *HederaConsensusDLTClient {
	return &HederaConsensusDLTClient{cfg: cfg, logger: logger}
}

func (c *HederaConsensusDLTClient) GetMessages() ([]string, error) {
	yesterday := time.Now().AddDate(0, 0, -7).Unix()
	messages := []string{}
	for _, topic := range c.cfg.Topics {
		response, err := http.Get(fmt.Sprintf(
			"%s/api/v1/topics/%s/messages?order=desc&timestamp=gt:%d",
			c.cfg.Mirror.GetURL(),
			topic,
			yesterday),
		)
		if err != nil {
			return []string{}, err
		}

		body, _ := io.ReadAll(response.Body)
		var msgs struct {
			Messages []map[string]any `json:"messages,omitempty"`
		}
		err = json.Unmarshal(body, &msgs)
		if err != nil {
			return []string{}, err
		}

		// Messages received in decending order because the default
		// limit is 25. While we could increase the limit, if recent
		// messages are more than the limit we will not get them in
		// the response
		//
		// Therefore, we fetch in descending order, but in order to return
		// the messages in ascending order, we reverse them here.
		ascendingOrderMessages := []map[string]any{}
		for i := range msgs.Messages {
			ascendingOrderMessages = append(
				ascendingOrderMessages,
				msgs.Messages[len(msgs.Messages)-1-i],
			)
		}

		for _, msg := range ascendingOrderMessages {
			encodedValue := msg["message"].(string)
			value, err := base64.StdEncoding.DecodeString(encodedValue)
			if err != nil {
				return []string{}, err
			}
			messages = append(messages, string(value))
		}

	}
	return messages, nil
}
