import "@mantine/core/styles.css";
import classes from "./App.module.css";

import { Box, MantineProvider, SimpleGrid } from "@mantine/core";
import { DKG } from "./components/dkg/dkg";
import { Onboarding } from "./components/onboarding/onboarding";
import { Forecasting } from "./components/forecasting/forecasting";
import { DigitalTwinAndInfraSelector } from "./components/smartShopping/root";

function App() {
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

      <SimpleGrid cols={3} spacing="md" className={classes.dash}>
        <Box className={classes.left}>
          <DKG />
          <Onboarding />
        </Box>
        <Box className={classes.center}>
          <DigitalTwinAndInfraSelector />
        </Box>
        <Box className={classes.right}>
          <Forecasting />
        </Box>
      </SimpleGrid>
    </MantineProvider>
  );
}

export default App;
