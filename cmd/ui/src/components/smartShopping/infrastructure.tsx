import classes from "./infrastructure.module.css";
import { Box, Flex, Popover } from "@mantine/core";

import { useDisclosure } from "@mantine/hooks";
export function Infrastructure() {
  return (
    <Box className={classes.center}>
      <Flex gap="40px">
        <Box className={classes.room1}>
          Room 1
          <Box className={classes.serverlist}>
            <Server workloads={0} name="Server 1" confidence={99} />
            <Server workloads={0} name="Server 2" confidence={53} />
            <Server workloads={0} name="Server 3" confidence={25} />
          </Box>
          <Flex direction="row" align="center" justify="center" gap="12px">
            <User name="User 1" />
            <User name="User 2" />
          </Flex>
        </Box>
        <Box className={classes.room2}>
          Room 2
          <Box className={classes.serverlist}>
            <Server workloads={0} name="Server 4" confidence={80} />
          </Box>
          <Flex direction="row" align="center" justify="center" gap="12px">
            <User name="User 1" />
            <User name="User 2" />
          </Flex>
        </Box>
      </Flex>
      <Box className={classes.cloud}>
        Cloud
        <Box className={classes.serverlist}>
          <Flex direction="row" align="center" justify="center" gap="32px">
            <Server workloads={0} name="Server 5" confidence={90} />
            <Server workloads={0} name="Server 6" confidence={95} />
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}

function Server(props: {
  workloads: number;
  name: string;
  confidence: number;
}) {
  const [opened, { close, open }] = useDisclosure(false);

  const getConfidenceBgColor = (confidence: number) => {
    if (confidence > 85) {
      return "#00AA00";
    } else if (confidence > 70) {
      return "#77B06A";
    } else if (confidence > 50) {
      return "#FFBF00";
    } else {
      return "#AA0000";
    }
  };

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
          <img
            className={classes.alvarium}
            src="./src/assets/icons/alvarium.png"
            width="24px"
          />
          <div
            className={classes.confidence}
            style={{ backgroundColor: getConfidenceBgColor(props.confidence) }}
          >
            {props.confidence}%
          </div>
          <Flex direction="column" align="center" justify="center">
            <img src="./src/assets/icons/server.svg" width="40px" />
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
            <img src="./src/assets/icons/alvarium.png" width="32px" />
            Annotations
          </div>
          <Flex direction="column">
            <div>SecureBoot=True</div>
            <div>TPM=True</div>
          </Flex>
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
}

function User(props: { name: string }) {
  return (
    <Flex direction="column" align="center" justify="center">
      <img src="./src/assets/icons/user.png" width="48px" />
      {props.name}
    </Flex>
  );
}
