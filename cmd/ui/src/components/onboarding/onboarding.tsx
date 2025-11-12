import classes from "./onboarding.module.css";
import { Box, Flex } from "@mantine/core";

export function Onboarding() {
  return (
    <Flex
      className={classes.secureonboarding}
      align="center"
      justify="start"
      direction="column"
    >
      <Flex align="center" justify="center" gap="8px">
        <img src="./src/assets/logos/hedera.png" width="48px" height="48px" />
        Secure Onboarding
      </Flex>
      <Box className={classes.securitylogs}>Logs...</Box>
    </Flex>
  );
}
