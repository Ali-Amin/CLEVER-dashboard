import { Box, Text } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import classes from "./forecasting.module.css";
import { useEffect, useState } from "react";
import {
  listenOnFakeMessages,
  type ForecastingMessage,
} from "../../api/forecasting/kafka";

export function Forecasting() {
  const [values, setValues] = useState<ForecastingMessage[]>([]);

  return (
    <Box className={classes.forecasting}>
      <Text size="lg" className={classes.title}>
        Forecasting
      </Text>

      <LineChart
        h={300}
        w="100%"
        withDots={false}
        withTooltip={false}
        withPointLabels
        data={[
          { time: 0, cpu: 24 },
          { time: 1.5, cpu: 20 },
          { time: 2, cpu: 21 },
          { time: 3, cpu: 24, forecasted: 24 },
          { time: 4, forecasted: 23 },
          { time: 5, forecasted: 21 },
        ]}
        dataKey="time"
        yAxisProps={{ domain: [0, 100] }}
        referenceLines={[{ x: 3, label: "Forecasted", color: "red.6" }]}
        series={[
          { name: "cpu", color: "indigo.6" },
          { name: "forecasted", color: "red.6" },
        ]}
      />
    </Box>
  );
}
