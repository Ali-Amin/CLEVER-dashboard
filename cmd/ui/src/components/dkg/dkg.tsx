import classes from "./dkg.module.css";
import { Box, Text } from "@mantine/core";

export function DKG() {
  return (
    <Box className={classes.graph}>
      <Text size="lg" className={classes.title}>
        Distributed Knowledge Graph
      </Text>
      <iframe
        src="http://10.18.1.100:30094"
        title="what is a title?"
        height="100%"
        frameBorder="0"
      />
    </Box>
  );
}
