import { pad, incrementsOfFive } from "./general";

/** timeFromDateCode - convert a smhi datecode into corresponding date object
 * @param {string} dateCode  - like "19062155" or "190621"
 * @return {Date}
 */
export function timeFromDateCode(dateCode) {
  const year = parseInt(dateCode[0] + dateCode[1]);
  const month = parseInt(dateCode[2] + dateCode[3]);
  const day = parseInt(dateCode[4] + dateCode[5]);
  const hour = parseInt(dateCode[6] + dateCode[7]);
  const minute = parseInt(dateCode[8] + dateCode[9]);
  const date = new Date();

  if (
    isNaN(year) ||
    isNaN(month) ||
    isNaN(day) ||
    (isNaN(hour) && hour == !undefined) ||
    (isNaN(minute) && minute == !undefined)
  ) {
    throw "dateCode not valid";
  }

  if (year) {
    date.setUTCFullYear(2000 + year);
  }
  if (month) {
    date.setUTCMonth(month - 1);
  }
  if (day) {
    date.setUTCDate(day);
  }
  if (hour) {
    date.setUTCHours(hour);
  } else {
    date.setUTCHours(0);
  }
  if (minute) {
    date.setUTCMinutes(minute);
  } else {
    date.setUTCMinutes(0);
  }

  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return date;
}

/** generateDateCode - create a smhi datecode from a timestamp, will set to
 * closest increment of five minutes (if including minutes and hours)
 * @param {number} time - timestamp
 * @param {Boolean} hour - include hours in code [hour=false]
 * @param {Boolean} minute - include minutes in code [minute=false]
 * @return {string} dateCode
 */
export function generateDateCode(time, hour = false, minute = false) {
  let dateCode = "";
  const date = new Date(time);

  if (typeof date !== "object") {
    console.error("date not real date got: ", date);
    return dateCode;
  }

  try {
    dateCode = `${date.getUTCFullYear() - 2000}${pad(
      date.getUTCMonth() + 1
    )}${pad(date.getUTCDate())}${hour ? pad(date.getUTCHours()) : ""}${
      minute ? pad(incrementsOfFive(date.getUTCMinutes())) : ""
    }`;
  } catch (e) {
    console.error("Error occured when trying to generate dateCode", e);
    return "";
  }

  return dateCode;
}

/** generateDateCodeRange - returns an array with valid datecodes for the stat of hours between 2 timestamps
 * @param {number} startStamp - timestamp
 * @param {number} endStamp - timestamp
 * @return {[string]} dateCode
 */
export function generateDateCodeRange(startStamp, endStamp) {
  let ret = [];

  if (startStamp && endStamp && startStamp < endStamp) {
    while (startStamp < endStamp) {
      ret.push(generateDateCode(startStamp, true, true));
      startStamp += 1000 * 60 * 5;
    }
  } else {
    console.error("start must be before end");
  }

  return ret;
}

/** timeFromFilePath
 * @param {string} path - file path that has a radar_datecode.pack file at the end
 * @return {number} - timestamp corresponding to the files name
 */
export function timeFromFilePath(path) {
  const fileName = path.substring(path.length - 20, path.length);
  return timeFromDateCode(
    fileName.match(/\d+/g).reduce((acc, char) => (acc += char), "")
  ).getTime();
}
