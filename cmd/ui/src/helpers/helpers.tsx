export const getConfidenceBgColor = (confidence: number) => {
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
