import "@mantine/core/styles.css";
import "./App.css";
import classes from "./HeaderMenu.module.css";

import { Box, Flex, MantineProvider, Popover } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

function App() {
  return (
    <MantineProvider>
      <Box>
        <header className={classes.header}>
          <div className={classes.inner}>
            <div className={classes.logo}>
              <img src="./src/assets/logos/clever_icon.png" height="56px" />
              <img src="./src/assets/logos/clever_text.png" height="56px" />
            </div>
            <img src="./src/assets/logos/chipsju.png" height="64px" />
          </div>
        </header>

        <Box className={classes.dashitem}>
          <Box className={classes.room1}>
            Room 1
            <Box className={classes.serverlist}>
              <Server workloads={0} name="Server 1" />
            </Box>
          </Box>
          <Box className={classes.room2}>
            Room 2
            <Box className={classes.serverlist}>
              <Server workloads={0} name="Server 2" />
            </Box>
          </Box>
        </Box>
      </Box>
    </MantineProvider>
  );
}

function Server(props: { workloads: number; name: string }) {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Popover
      width={200}
      position="bottom"
      withArrow
      shadow="md"
      opened={opened}
    >
      <Popover.Target>
        <Box
          className={classes.server}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <Flex direction="column">
            <img src="./src/assets/icons/server.svg" width="64px" />
            {props.name}
          </Flex>
          <Box className={classes.workloads}>Workloads: {props.workloads}</Box>
        </Box>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: "none" }}>
        <Box className={classes.serverdetails}>
          <div className={classes.title}>
            <img
              style={{ paddingRight: "4px" }}
              src="./src/assets/icons/pod.svg"
              width="32px"
            />{" "}
            Pods
          </div>
          <Flex direction="column">
            <div>pod1</div> <div>pod2</div> <div>pod3</div>
          </Flex>
        </Box>
        <Box className={classes.serverdetails}>
          <div className={classes.title}>
            <img src="./src/assets/icons/alvarium.svg" width="32px" />
            Annotations
          </div>
          <Flex direction="column">
            <div>pod1</div> <div>pod2</div> <div>pod3</div>
          </Flex>
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
}

export default App;
