export const getDeviceConfidence = async (
  deviceName: string,
  cluster: "cluster1" | "cluster2",
): Promise<number> => {
  const DCF_API_CLUSTER1_BASE_URL = "http://10.18.1.100:30085";
  const DCF_API_CLUSTER2_BASE_URL = "http://10.18.1.30:30085";
  try {
    let baseUrl: string = "";
    switch (cluster) {
      case "cluster1":
        baseUrl = DCF_API_CLUSTER1_BASE_URL;
        break;
      case "cluster2":
        baseUrl = DCF_API_CLUSTER2_BASE_URL;
        break;
    }
    const response = await fetch(`${baseUrl}/hosts/${deviceName}/confidence`);
    const json = await response.json();
    return json["confidence"] * 100;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const getDeviceAnnotations = async (
  deviceName: string,
): Promise<{ name: string; isSatisfied: boolean }[]> => {
  try {
    console.log(deviceName);
    return [{ name: "example", isSatisfied: false }];
  } catch (error) {
    console.log(error);
    return [];
  }
};
