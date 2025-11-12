import classes from "./dkg.module.css";
import { Box } from "@mantine/core";

export function DKG() {
  return (
    <Box className={classes.graph}>
      <Box className={classes.title}> DKG</Box>
      <iframe
        src="http://10.18.1.100:30094"
        title="what is a title?"
        height="100%"
        frameBorder="0"
      />
    </Box>
  );
}
