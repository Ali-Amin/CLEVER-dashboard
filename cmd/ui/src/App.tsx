import "@mantine/core/styles.css";
import classes from "./App.module.css";

import {
  Box,
  Flex,
  Loader,
  MantineProvider,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { DKG } from "./components/dkg/dkg";
import { Onboarding } from "./components/onboarding/onboarding";
import { Scheduling } from "./components/scheduling/scheduling";
import { Forecasting } from "./components/forecasting/forecasting";
import { DigitalTwinAndInfraSelector } from "./components/smartShopping/root";
import { useEffect, useRef, useState } from "react";
import type { Server } from "./api/dkg/dkg";

function App() {
  const socketRef = useRef<any>(null);
  const [updatedSchedulingData, setUpdatedSchedulingData] = useState<any[]>([]);
  const [updatedDltData, setUpdatedDltData] = useState<string[]>([]);
  const [updatedInfraData, setUpdatedInfraData] =
    useState<Map<string, Server[]>>();
  const [schedulingData, setSchedulingData] = useState<any[]>([]);
  const [dltData, setDltData] = useState<string[]>([]);
  const [infraData, setInfraData] = useState<Map<string, Server[]>>();
  const [forecastData, setForecastData] =
    useState<
      Map<
        string,
        { timestamp: string; actual_cpu: number; forecasted_cpu: number }[]
      >
    >();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const socket = new WebSocket("ws://172.19.205.208:30080");

    socket.addEventListener("open", (event) => {
      console.log("connection opened");
    });
    socket.addEventListener("close", (event) => {
      console.log("connection closed");
    });
    socket.addEventListener("message", (event) => {
      console.log("message received");
      setLoading(false);
      const d = JSON.parse(event.data);
      console.log(d);
      setUpdatedDltData(d.dlt);
      setUpdatedInfraData(d.infra);
      setUpdatedSchedulingData(d.scheduling);
      setForecastData(d.forecast);
    });
    socketRef.current = socket;
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (updatedDltData.length !== dltData.length) {
      setDltData(updatedDltData);
    } else {
      for (var i = 0; i < updatedDltData.length; i++) {
        if (updatedDltData[i] !== dltData[i]) {
          console.log(updatedDltData[i], dltData[i]);
          setDltData(updatedDltData);
          break;
        }
      }
    }

    if (updatedSchedulingData.length !== schedulingData.length) {
      setSchedulingData(updatedSchedulingData);
    } else {
      for (var i = 0; i < updatedSchedulingData.length; i++) {
        if (updatedSchedulingData[i].message != schedulingData[i].message) {
          setSchedulingData(updatedSchedulingData);
          break;
        }
      }
    }

    if (updatedInfraData !== infraData) {
      setInfraData(updatedInfraData);
    }
  }, [updatedDltData, updatedInfraData, updatedSchedulingData]);

  return (
    <MantineProvider>
      <header className={classes.header}>
        <div className={classes.inner}>
          <div className={classes.logo}>
            <img src="./src/assets/logos/clever_icon.png" height="32px" />
            <img src="./src/assets/logos/clever_text.png" height="32px" />
          </div>
          <Text size="xl">Smart Shopping</Text>
          <img src="./src/assets/logos/chipsju.png" height="38px" />
        </div>
      </header>

      {loading || infraData === undefined ? (
        <Flex w="100vw" h="100vh" align="center" justify="center">
          <Loader />
        </Flex>
      ) : (
        <SimpleGrid cols={3} spacing="md" className={classes.dash}>
          <Box className={classes.left}>
            <DKG />
            <Onboarding messages={dltData} />
          </Box>
          <Box className={classes.center}>
            <DigitalTwinAndInfraSelector infra={infraData} />
          </Box>
          <Box className={classes.right}>
            <Forecasting data={forecastData} />
            <Scheduling messages={schedulingData} />
          </Box>
        </SimpleGrid>
      )}
    </MantineProvider>
  );
}

export default App;
