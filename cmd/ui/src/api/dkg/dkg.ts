export const getInfra = async (): Promise<Map<string, any>> => {
  try {
    const infra: Map<string, any> = new Map();
    const clusters = await getClusters();
    for (const cluster of clusters) {
      const servers = await getServers(cluster["id"]);
      const serverNames = servers.map((s) => s["hostname"]);
      infra.set(cluster["id"], serverNames);
    }
    return infra;
  } catch (error) {
    console.log(error);
    return new Map();
  }
};

export const getClusters = async (): Promise<any[]> => {
  try {
    const response = await fetch("http://10.18.1.100:30094/clusters");
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getServers = async (clusterName: string): Promise<any[]> => {
  try {
    const response = await fetch(
      `http://10.18.1.100:30094/clusters/${clusterName}/nodes`,
    );
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
    return [];
  }
};
