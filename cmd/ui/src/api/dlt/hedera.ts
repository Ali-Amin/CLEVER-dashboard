export const getHederaMessage = async (
  lastSequenceNumber: number,
): Promise<string> => {
  const TOPIC_ID = "0.0.1033";
  const MIRROR_NODE_BASE_URL = "http://10.18.1.35:5551";
  try {
    const response = await fetch(
      `${MIRROR_NODE_BASE_URL}/api/v1/topics/${TOPIC_ID}/messages?limit=1&order=asc&sequencenumber=${lastSequenceNumber}`,
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP error ${response.status}: ${error}`);
    }

    const chunks = (await response.json())["messages"];
    const messages = [];
    for (const chunk of chunks) {
      const message = chunk["message"];
      messages.push(atob(message));
    }
    return messages[0];
  } catch (error) {
    console.log(error);
    return "";
  }
};
