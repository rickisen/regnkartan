export function incrementsOfFive(num) {
  const x = num / 5;
  const y = Math.round(x);
  return y * 5;
}

export function pad(n, width = 2, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export function timeFromDateCode(dateCode) {
  const year = parseInt(dateCode[0] + dateCode[1]);
  const month = parseInt(dateCode[2] + dateCode[3]);
  const day = parseInt(dateCode[4] + dateCode[5]);
  const hour = parseInt(dateCode[6] + dateCode[7]);
  const minute = parseInt(dateCode[8] + dateCode[9]);
  const date = new Date();
  date.setUTCFullYear(year);
  date.setUTCMonth(month - 1);
  date.setUTCDate(day);
  date.setUTCHours(hour);
  date.setUTCMinutes(minute);
  return date;
}

export function generateDateCode(date, hour = false, minute = false) {
  let dateCode = "";

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

export function generateDateCodeRange(start, end) {
  let ret = [];
  let startStamp = 0;
  let endStamp = 0;

  try {
    startStamp = start.getTime();
    endStamp = end.getTime();
  } catch (e) {
    console.error(
      "Both start and end must be valid Date object got: ",
      start,
      end,
      e
    );
  }

  if (startStamp && endStamp && startStamp < endStamp) {
    while (startStamp < endStamp) {
      ret.push(generateDateCode(new Date(startStamp), true, true));
      startStamp += 1000 * 60 * 5;
    }
  } else {
    console.error("start must be before end");
  }

  return ret;
}

// https://stackoverflow.com/questions/4833651/javascript-array-sort-and-unique
export function sort_unique(arr) {
  if (arr.length === 0) return arr;
  arr = arr.sort(function(a, b) {
    return a * 1 - b * 1;
  });
  var ret = [arr[0]];
  for (var i = 1; i < arr.length; i++) {
    //Start loop at 1: arr[0] can never be a duplicate
    if (arr[i - 1] !== arr[i]) {
      ret.push(arr[i]);
    }
  }
  return ret;
}