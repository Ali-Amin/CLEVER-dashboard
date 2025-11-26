import { Box, Flex, Text } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import classes from "./forecasting.module.css";
import { useEffect, useState } from "react";

export function Forecasting(props: { data: any }) {
  const [plotData, setPlotData] = useState<any[]>();
  useEffect(() => {
    if (
      props.data == null ||
      props.data === undefined ||
      props.data["recommendationservice-7fd87c699b-cn42v"] === null ||
      props.data["recommendationservice-7fd87c699b-cn42v"] === undefined
    )
      return;
    const data = props.data["recommendationservice-7fd87c699b-cn42v"]
      .map((d) => {
        return {
          timestamp: new Date(Date.parse(d.timestamp)).toLocaleString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          forecasted_cpu: d.forecasted_cpu / 100,
          actual_cpu: d.actual_cpu / 100,
        };
      })
      .sort((d1, d2) => d1.timestamp - d2.timestamp)
      .slice(0, 60);
    console.log(data);
    setPlotData(data);
  }, [props.data]);

  return (
    <Box className={classes.forecasting}>
      <Text size="lg" className={classes.title}>
        Forecasting
      </Text>
      <Flex dir="row" align="center" gap="16px">
        <Box h="2px" bg="red" w="24px" />
        Forecast
      </Flex>

      <Flex dir="row" align="center" gap="16px" pb="24px">
        <Box h="2px" bg="indigo" w="24px" />
        Actual
      </Flex>
      <LineChart
        h={300}
        w="100%"
        withDots={false}
        withTooltip={false}
        //withPointLabels
        data={plotData}
        dataKey="timestamp"
        unit="%"
        yAxisLabel="CPU"
        xAxisLabel="Time"
        gridAxis="xy"
        yAxisProps={{ domain: [0, 100] }}
        series={[
          { name: "actual_cpu", label: "Actual", color: "indigo.6" },
          { name: "forecasted_cpu", label: "Forecast", color: "red.6" },
        ]}
      />
    </Box>
  );
}
