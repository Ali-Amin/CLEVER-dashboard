import { Tabs } from "@mantine/core";
import { Infrastructure } from "./infrastructure";

export function DigitalTwinAndInfraSelector(props: {
  infra: Map<string, any>;
}) {
  return (
    <Tabs
      color="#1bb297"
      variant="pills"
      radius="xs"
      defaultValue="Infrastructure"
    >
      <Tabs.List
        style={{ marginBottom: "12px", justifySelf: "center", outline: 0 }}
      >
        {/*   <Tabs.Tab value="Digital Twin">
          Digital Twin
        </Tabs.Tab>*/}
        <Tabs.Tab value="Infrastructure">Infrastructure</Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="Digital Twin">Digital twin content</Tabs.Panel>

      <Tabs.Panel value="Infrastructure">
        <Infrastructure clusterServers={props.infra} />
      </Tabs.Panel>
    </Tabs>
  );
}
