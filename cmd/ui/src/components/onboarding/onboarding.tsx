import { useEffect, useRef, useState } from "react";
import classes from "./onboarding.module.css";
import { Box, Loader, Flex, Text } from "@mantine/core";

interface AnnotationList {
  items: {
    id: string;
    key: string;
    hash: "sha256" | "md5";
    host: string;
    tag: string;
    layer: string;
    kind: string;
    signature: string;
    isSatisfied: boolean;
    timestamp: string;
  }[];
}

export function Onboarding(props: { messages: string[] }) {
  const [logs, setLogs] = useState<
    {
      type: "dcf" | "dlt";
      log: string;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // The DLT messages can have extremely large length, so the API limits it to
  // 25 messages. When new messages are published, a rolling window behavior occurs
  // where the oldest messages are no longer displayed.
  //
  // To simulate a scrolling behavior when the messages are updated, we scroll up
  // a little bit then scroll back down.
  const scrollToBottom = () => {
    if (logsEndRef.current) {
      const currentScroll = logsEndRef.current.scrollTop;
      const heightToScrollDownFrom = 30; // Adjust based on your element height
      logsEndRef.current.scrollTop = currentScroll - heightToScrollDownFrom;
      logsEndRef.current.scrollTo({
        top: logsEndRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const parseHederaMessage = (msg: string) => {
    try {
      const msgJson = JSON.parse(msg);
      const annotations: AnnotationList = JSON.parse(atob(msgJson["content"]));
      return {
        action: msgJson["action"],
        messageType: msgJson["messageType"],
        content: annotations,
      };
    } catch (error) {
      console.log("Unknown message format detected: " + error);
    }
  };

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    setLogs([]);
    for (const message of props.messages) {
      if (message !== "" && message !== undefined) {
        const parsedMessage = parseHederaMessage(message);
        setLogs((prevLogs) => [
          ...prevLogs,
          { type: "dlt", log: `Message: ${JSON.stringify(parsedMessage)}` },
        ]);
        if (parsedMessage?.content) {
          for (const annotation of parsedMessage.content.items) {
            if (annotation.host === "onboarder") {
              let log;
              if (annotation.isSatisfied) {
                log = `Identity of node '${annotation.key}' verified successfully`;
              } else {
                log = `Identity of node '${annotation.key}' failed verification`;
              }
              setLogs((prevLogs) => [...prevLogs, { type: "dcf", log: log }]);
            } else {
              if (annotation.layer == "host") {
                const log = annotation.isSatisfied
                  ? `Node '${annotation.key}' passed ${annotation.kind} check`
                  : `Node '${annotation.key}' failed ${annotation.kind} check`;

                setLogs((prevLogs) => [...prevLogs, { type: "dcf", log: log }]);
              } else if (annotation.layer == "cicd") {
                const log = annotation.isSatisfied
                  ? `User ${annotation.key} passed ${annotation.kind} check`
                  : `User ${annotation.key} failed ${annotation.kind} check`;

                setLogs((prevLogs) => [...prevLogs, { type: "dcf", log: log }]);
              }
            }
          }
        }
      }
    }

    return () => {
      clearTimeout(loadingTimer);
    };
  }, [props.messages]);

  return (
    <Flex
      className={classes.secureonboarding}
      align="center"
      justify="start"
      direction="column"
      ref={logsEndRef}
    >
      <Flex align="center" justify="center" gap="8px">
        <Text size="lg" className={classes.title}>
          Onboarding Layer
        </Text>
      </Flex>
      {loading ? (
        <Box pt="80px">
          <Loader />
        </Box>
      ) : (
        logs?.map((log, i) => (
          <Flex
            direction="row"
            align="start"
            gap="12px"
            justify="start"
            pt="12px"
            w="100%"
            key={`${i}${log}`}
          >
            {log.type == "dcf" ? (
              <img src="./src/assets/icons/alvarium.png" width="28px" />
            ) : (
              <img src="./src/assets/logos/hedera.png" width="28px" />
            )}
            <Box key={`${i}:${log}`} className={classes.securitylogs}>
              <Text lineClamp={2}>{log.log}</Text>
            </Box>
          </Flex>
        ))
      )}
    </Flex>
  );
}
