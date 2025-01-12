import { Interface } from "readline";

export const findDeliveryCharge = (
  state: string,
  charge: { inside_kerala: string; outside_kerala: string }
) => {
  return state.toLowerCase() == "kerala"
    ? charge.inside_kerala
    : charge.outside_kerala;
};

export function getDeliveryDate(startDate:Date, numberOfDays:number) {
  var resultDate = new Date(
    startDate.getTime() + numberOfDays * 24 * 60 * 60 * 1000
  );
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var formattedDate =
    days[resultDate.getDay()] +
    ", " +
    months[resultDate.getMonth()] +
    " " +
    resultDate.getDate();
  return formattedDate; // Format the date as desired

}

export  function convertKeysToSnakeCase(obj:any) {
  console.log("going to convert keys")
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const snakeCaseObj:any = {};

  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeCaseKey = key.replace(
        /[A-Z]/g,
        (match) => `_${match.toLowerCase()}`
      );
      snakeCaseObj[snakeCaseKey] = convertKeysToSnakeCase(obj[key]);
    }
  }
  console.log("end to convert keys");
  return snakeCaseObj;
}

export function generateRandomColors(numColors: number): {
  backgroundColors: string[];
  borderColors: string[];
} {
  const backgroundColors = [];
  const borderColors = [];

  for (let i = 0; i < numColors; i++) {
    const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.7)`;
    backgroundColors.push(randomColor);
    borderColors.push(randomColor.replace("0.7", "1"));
  }

  return { backgroundColors, borderColors };
}