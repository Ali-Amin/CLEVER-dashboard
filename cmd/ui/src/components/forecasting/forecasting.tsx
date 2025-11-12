import { Box } from "@mantine/core";
import classes from "./forecasting.module.css";

export function Forecasting() {
  return (
    <Box className={classes.forecasting}>
      <Box className={classes.title}>Forecasting</Box>
      <Box>Plots</Box>
      <Box>Logs</Box>
    </Box>
  );
}
