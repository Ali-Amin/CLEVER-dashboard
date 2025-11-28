import { IconCircle, IconCircleFilled } from "@tabler/icons-react";
import classes from "./dkg.module.css";
import { Box, Flex, Text } from "@mantine/core";

export function DKG() {
  return (
    <Box className={classes.graph}>
      <Text size="lg" className={classes.title}>
        Distributed Knowledge Graph
      </Text>
      <Flex dir="row" p="12px" align="center" justify="center">
        <IconCircleFilled color="#33ffa2" />
        <Text pr="12px">Cluster</Text>

        <IconCircleFilled color="#ff0000" />
        <Text pr="12px">Node</Text>

        <IconCircleFilled color="#00ff00" />
        <Text pr="12px">Pod</Text>

        <IconCircleFilled color="#0000ff" />
        <Text pr="12px">Container</Text>

        <IconCircleFilled color="#03f0fc" />
        <Text pr="12px">Image</Text>

        <IconCircleFilled color="#1d87c9" />
        <Text pr="12px">Service</Text>
      </Flex>
      <iframe
        src="http://10.18.1.100:30094"
        title="what is a title?"
        height="100%"
        frameBorder="0"
      />
    </Box>
  );
}
