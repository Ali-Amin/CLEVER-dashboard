import classes from "./infrastructure.module.css";
import { Box, Flex, Grid, Popover, Text } from "@mantine/core";
import { getConfidenceBgColor } from "../../helpers/helpers";

import { useDisclosure } from "@mantine/hooks";
import { type Server } from "../../api/dkg/dkg";

export function Infrastructure(props: {
  clusterServers: { cluster1: Server[]; cluster2: Server[] };
}) {
  console.log(props.clusterServers.cluster2[1]);
  return (
    <Box className={classes.center}>
      <Flex gap="40px">
        <Box className={classes.room1}>
          <Box className={classes.title}>Floor 1</Box>
          <Text pt="12px" size="sm" className={classes.title}>
            Users
          </Text>
          <Flex
            pt="24px"
            direction="row"
            align="center"
            justify="center"
            gap="12px"
          >
            <User name="User 1" confidence={99} />
            {props.clusterServers.cluster1?.find(
              (s: Server) =>
                s.pods?.find((p) => p == "user3-qos") !== undefined,
            ) ? (
              <User name="User 3" confidence={88} />
            ) : undefined}
          </Flex>
          <Text pt="12px" size="sm" className={classes.title}>
            Servers
          </Text>
          <Grid columns={2} className={classes.serverlist}>
            {props.clusterServers.cluster1.map((server: Server) => {
              return (
                <Grid.Col span={1} key={server.id}>
                  {/*For a demo*/}
                  <Server
                    server={
                      server.hostname === "open-guppy"
                        ? { ...server, confidence: 60 }
                        : server.hostname === "exotic-weevil"
                          ? { ...server, confidence: 70 }
                          : server.hostname === "alert-boxer"
                            ? { ...server, confidence: 60 }
                            : server.hostname === "braine-head-node"
                              ? { ...server, confidence: 98 }
                              : server
                    }
                  />
                </Grid.Col>
              );
            })}
          </Grid>
        </Box>
        <Box className={classes.room2}>
          <Box className={classes.title}>Floor 2</Box>
          <Text pt="12px" size="sm" className={classes.title}>
            Users
          </Text>
          <Flex
            pt="24px"
            direction="row"
            align="center"
            justify="center"
            gap="12px"
          >
            <User name="User 2" confidence={66} />
            {props.clusterServers.cluster2?.find(
              (s: Server) =>
                s.pods?.find((p) => p == "user4-qos") !== undefined,
            ) ? (
              <User name="User 4" confidence={88} />
            ) : undefined}
          </Flex>
          <Text pt="12px" size="sm" className={classes.title}>
            Servers
          </Text>
          <Grid columns={2} className={classes.serverlist}>
            {props.clusterServers.cluster2.map((server) => {
              console.log(server.hostname);
              return (
                <Grid.Col span={1} key={server.id}>
                  <Server
                    server={
                      server.hostname === "clever-shradda-work02"
                        ? { ...server, confidence: 60 }
                        : server
                    }
                  />
                </Grid.Col>
              );
            })}
          </Grid>
        </Box>
      </Flex>
      {/* <Box className={classes.cloud}>
        <Box className={classes.title}>Cloud</Box>
        <Box className={classes.serverlist}>
          <Flex direction="row" align="center" justify="center" gap="32px">
            <Server
              server={{ name: "Server 5", pods: [], id: "server5" }}
              confidence={90}
            />
            <Server
              server={{ name: "Server 5", pods: [], id: "server5" }}
              confidence={90}
            />
          </Flex>
        </Box>
      </Box>*/}
    </Box>
  );
}

function Server(props: { server: Server }) {
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
        <Flex direction="column" align="center" justify="center">
          <Box
            className={classes.server}
            onMouseEnter={open}
            onMouseLeave={close}
            pr="14px"
          >
            <img
              className={classes.alvarium}
              src="./src/assets/icons/alvarium.png"
              width="24px"
            />
            <div
              className={classes.confidence}
              style={{
                backgroundColor: getConfidenceBgColor(props.server.confidence),
              }}
            >
              {props.server.confidence ?? 0}%
            </div>
            <img src="./src/assets/icons/server.svg" width="40px" />
          </Box>
          <Text maw="100px" pl="10px" pb="12px" size="xs" truncate="start">
            {props.server.hostname}
          </Text>
        </Flex>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: "none" }} w="340px">
        <Box className={classes.serverdetails}>
          <div className={classes.title}>
            {" "}
            <img
              style={{ paddingRight: "4px" }}
              src="./src/assets/icons/server.svg"
              width="24px"
            />{" "}
            {props.server.hostname}
          </div>
          <div>Internal IP:{props.server.internalIP}</div>
          <div>CPU: {props.server.usage_cpu} nCPU</div>
          <div> Memory: {props.server.usage_memory / 1000}KiB</div>
          <div className={classes.title}>
            <img
              style={{ paddingRight: "4px" }}
              src="./src/assets/icons/pod.svg"
              width="32px"
            />{" "}
            Pods
          </div>
          <Flex direction="column">
            {props.server.pods === undefined ||
            props.server.pods.length === 0 ? (
              <div>No pods...</div>
            ) : (
              props.server.pods?.map((p) => <div key={p}>{p}</div>)
            )}
          </Flex>
        </Box>
        {/*

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
*/}
      </Popover.Dropdown>
    </Popover>
  );
}

function User(props: { name: string; confidence: number }) {
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
        <Box className={classes.user} onMouseEnter={open} onMouseLeave={close}>
          <img
            className={classes.useralvarium}
            src="./src/assets/icons/alvarium.png"
            width="24px"
          />
          <div
            className={classes.userconfidence}
            style={{ backgroundColor: getConfidenceBgColor(props.confidence) }}
          >
            {props.confidence}%
          </div>
          <Flex direction="column" align="center" justify="center">
            <img src="./src/assets/icons/user.png" width="48px" />
            {props.name}
          </Flex>
        </Box>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: "none" }}>
        <Box className={classes.serverdetails}>
          <div className={classes.title}>
            <img src="./src/assets/icons/alvarium.png" width="32px" />
            Annotations
          </div>
          <Flex direction="column">
            <div>SCA=True</div>
            <div>Checksum=True</div>
          </Flex>
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
}
