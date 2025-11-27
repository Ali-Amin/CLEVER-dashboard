import { useEffect, useRef, useState } from "react";
import classes from "./scheduling.module.css";
import { Box, Loader, Flex, Text } from "@mantine/core";
import { IconAdjustmentsFilled } from "@tabler/icons-react";

export function Scheduling(props: { messages: string[] }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    console.log(props.messages);
    setLogs(props.messages);

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
          Schedulers
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
            {log.type == "local" ? (
              <img src="./src/assets/icons/pod.svg" width="28px" />
            ) : (
              <IconAdjustmentsFilled width="28px" />
            )}
            <Box key={`${i}:${log}`} className={classes.securitylogs}>
              <Text lineClamp={2}>{log.message}</Text>
            </Box>
          </Flex>
        ))
      )}
    </Flex>
  );
}
