import { useEffect, useRef, useState } from "react";
import classes from "./onboarding.module.css";
import { Box, Loader, Flex } from "@mantine/core";
import { getHederaMessage } from "../../api/dlt/hedera";

export function Onboarding() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const lastSequenceRef = useRef<number>(1);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 200000);

    const fetchInterval = setInterval(() => {
      const seqToFetch = lastSequenceRef.current;
      getHederaMessage(seqToFetch)
        .then((message) => {
          console.log(seqToFetch, message);
          if (message !== "" && message !== undefined) {
            setLogs((prevLogs) => [...prevLogs, message]);
            lastSequenceRef.current = seqToFetch + 1;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, 200000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(fetchInterval);
    };
  }, []);
  return (
    <Flex
      className={classes.secureonboarding}
      align="center"
      justify="start"
      direction="column"
    >
      <Flex align="center" justify="center" gap="8px">
        <img src="./src/assets/logos/hedera.png" width="48px" height="48px" />
        <Box className={classes.title}>DLT</Box>
      </Flex>
      {loading ? (
        <Box pt="80px">
          <Loader />
        </Box>
      ) : (
        logs?.map((log, i) => (
          <Box key={`${i}:${log}`} className={classes.securitylogs}>
            {log}
          </Box>
        ))
      )}
    </Flex>
  );
}
