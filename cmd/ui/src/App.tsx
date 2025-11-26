import "@mantine/core/styles.css";
import classes from "./App.module.css";

import { Box, Loader, MantineProvider, SimpleGrid } from "@mantine/core";
import { DKG } from "./components/dkg/dkg";
import { Onboarding } from "./components/onboarding/onboarding";
import { Forecasting } from "./components/forecasting/forecasting";
import { DigitalTwinAndInfraSelector } from "./components/smartShopping/root";
import { useEffect, useRef, useState } from "react";
import type { Server } from "./api/dkg/dkg";

function App() {
  const socketRef = useRef<any>(null);
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

    socket.addEventListener("message", (event) => {
      console.log("message received");
      setLoading(false);
      const d = JSON.parse(event.data);

      if (d.dlt.length !== dltData.length) {
        console.log(d.dlt.length, dltData.length);
        setDltData(d.dlt);
      } else {
        for (var i = 0; i < d.dlt.length; i++) {
          if (d.dlt[i] !== dltData[i]) {
            console.log(d.dlt[i], dltData[i]);
            setDltData(d.dlt);
            break;
          }
        }
      }

      if (d.infra !== infraData) {
        setInfraData(d.infra);
      }

      setForecastData(d.forecast);
      console.log(d.forecast);
    });
    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, [dltData, infraData]);

  return (
    <MantineProvider>
      <header className={classes.header}>
        <div className={classes.inner}>
          <div className={classes.logo}>
            <img src="./src/assets/logos/clever_icon.png" height="32px" />
            <img src="./src/assets/logos/clever_text.png" height="32px" />
          </div>
          <img src="./src/assets/logos/chipsju.png" height="38px" />
        </div>
      </header>

      {loading || infraData === undefined ? (
        <Loader />
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
          </Box>
        </SimpleGrid>
      )}
    </MantineProvider>
  );
}

export default App;
