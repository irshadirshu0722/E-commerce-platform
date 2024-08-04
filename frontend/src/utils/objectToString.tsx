export function objectToString(
  data: any,
  start?: number,
  iteration?: number
): string {
  let st = "";
  if (start && iteration) {
    iteration -= start;
  }
  let idxCounter = 0; // Counter to keep track of the index
  if (data && typeof data === "object") {
    Object.keys(data).forEach((key) => {
      if (start !== undefined && idxCounter < start) {
        idxCounter++;
        return;
      }
      if (iteration !== undefined && iteration !== 0) {
        iteration -= 1;
      } else if (iteration !== undefined && iteration === 0) {
        return st.trim();
      }
      if (data[key] !== undefined && data[key] !== null) {
        st += data[key].toString() + " ";
      }
      idxCounter++;
    });
  }
  return st.trim();
}
