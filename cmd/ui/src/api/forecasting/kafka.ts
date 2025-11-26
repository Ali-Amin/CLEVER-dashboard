export interface ForecastingMessage {
  pod: string;
  cpu: number;
  time: number;
}

export const listenOnForecastingMessages = async (
  onNewMessage: (message: ForecastingMessage) => void,
) => {};

export const listenOnFakeMessages = async (
  onNewMessage: (message: ForecastingMessage) => void,
) => {
  setInterval(() => {
    const newRandomNumber = 50 - Math.random() * 10;
    onNewMessage({
      pod: "recommendation-engine",
      cpu: newRandomNumber,
      time: Date.now(),
    });
  }, 2000);
};
