import { Box, Button, Flex, Menu, Text } from "@mantine/core";
import { LineChart } from "@mantine/charts";
import classes from "./forecasting.module.css";
import { useEffect, useState } from "react";

export function Forecasting(props: { data: any }) {
  const [plotData, setPlotData] = useState<any[]>();
  const [pods, setPods] = useState<string[]>();
  const [selectedPod, setSelectedPod] = useState<string>();

  useEffect(() => {
    if (props.data) {
      const parsed = new Map<string, any[]>(Object.entries(props.data));
      const p = Array.from(parsed.keys());
      setPods(p);
      const defaultPod = p[0];
      if (!selectedPod) {
        setSelectedPod(defaultPod);
      }
      if (parsed && selectedPod && parsed.get(selectedPod)) {
        const data = parsed
          .get(selectedPod)
          .map((d) => {
            return {
              timestamp: new Date(Date.parse(d.timestamp)).toLocaleString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              }),
              forecasted_cpu: d.forecasted_cpu?.toFixed(2),
              actual_cpu: d.actual_cpu?.toFixed(2),
            };
          })
          .sort((d1, d2) => d1.timestamp - d2.timestamp);
        //          .slice(0, 60);
        setPlotData(data);
      }
    }
  }, [props.data, selectedPod]);

  return (
    <Box className={classes.forecasting}>
      <Text size="lg" className={classes.title}>
        Resource Utilization
      </Text>
      <Flex dir="row" align="center" justify="space-between">
        <Box>
          <Flex dir="row" align="center" gap="16px">
            <Box h="2px" bg="red" w="24px" />
            Forecast
          </Flex>

          <Flex dir="row" align="center" gap="16px" pb="24px">
            <Box h="2px" bg="indigo" w="24px" />
            Actual
          </Flex>
        </Box>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button>{selectedPod}</Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Pods</Menu.Label>
            {pods?.map((p) => (
              <Menu.Item
                onClick={() => {
                  setSelectedPod(p);
                }}
              >
                {p}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
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
