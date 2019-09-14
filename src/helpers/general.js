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
  }
  if (minute) {
    date.setUTCMinutes(minute);
  }
  return date;
}

/** @function generateDateCode
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

/** @function generateDateCodeRange
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

export function timeIncrementsInRange(increment, { start, end }) {
  const ret = [];
  const applyIncrement = iter => new Date(iter.getTime() + increment);

  for (var i = new Date(start); i.getTime() < end; i = applyIncrement(i)) {
    ret.push(new Date(i.getTime()));
  }

  return ret;
}

export function midpointInRange({ start, end }) {
  const diff = end - start;
  return new Date(start + diff / 2);
}

/** @function packHoursIntoChunks
 * @param {Array} requestedHours - hours to put in the chunks, (should be an array of timestamps for begining at an hour)
 * @param {Object} chunks - chunks object, with timestamp for key [chunks={}]
 * @param {Number} chunkSize - Size in ms of newly created chunks
 * @return {Object} chunks - chunks object, with timestamp for key
 */
export function packHoursIntoChunks(
  requestedHours = [],
  chunks = {},
  chunkSize = 3 * 1000 * 60 * 60,
  depth = 0
) {
  // Find hours not in chunks
  const hoursNotInAChunk = requestedHours.reduce((acc, hour) => {
    let found = false;
    for (var stamp in chunks) {
      const chunk = chunks[stamp];
      const chunkBegin = parseInt(stamp);
      const chunkEnd = chunkBegin + chunk.chunkSize;
      if (hour >= chunkBegin && hour < chunkEnd) {
        found = true;
      }
    }
    if (!found) {
      return [...acc, hour];
    }
    return acc;
  }, []);
  // if all are covered return chunks, we are done
  if (hoursNotInAChunk.length === 0 || depth > 10) {
    return chunks;
  }
  const sortedChunkKeys = Object.keys(chunks).sort();

  // key for new chunk to add, default to end at the begining of the current
  // hour if there are no present chunks
  const beginingOfCurrentHour = begginingOfHour();
  let chunkKey = beginingOfCurrentHour - chunkSize;
  // Do we need to schedule a future chunk, or a past chunk
  if (
    sortedChunkKeys.length > 0 &&
    hoursNotInAChunk[0] < parseInt(sortedChunkKeys[0])
  ) {
    chunkKey = parseInt(sortedChunkKeys[0]) - chunkSize;
  } else if (
    sortedChunkKeys.length > 0 &&
    hoursNotInAChunk[0] > parseInt(sortedChunkKeys[0])
  ) {
    const lastChunkKey = sortedChunkKeys[sortedChunkKeys.length - 1];
    const lastChunk = chunks[lastChunkKey];
    chunkKey = parseInt(lastChunkKey) + lastChunk.chunkSize;
  }

  const newChunks = {
    ...chunks,
    ["" + chunkKey]: {
      status: "qued",
      unpackedFiles: [],
      chunkSize,
    },
  };

  // recurse
  return packHoursIntoChunks(hoursNotInAChunk, newChunks, chunkSize, ++depth);
}

export function hourRangeFrom(start = new Date().getTime(), size = 100) {
  const begginingOfThatHour = begginingOfHour(new Date(start));
  const endOfThatHour = begginingOfThatHour + 1000 * 60 * 60;
  const startStamp = endOfThatHour - 1000 * 60 * 60 * (size - 1);
  const range = [];

  for (var hour = 0; hour < size; hour++) {
    range[hour] = startStamp + hour * 1000 * 60 * 60;
  }

  return range;
}

/** @function begginingOfHour
 * @param {Date} date - Date object representing the time we will find an hour for
 * @return {number} timestamp for that dates begining hour
 */
export function begginingOfHour(d = new Date()) {
  const date = new Date(d.getTime());

  date.setUTCMinutes(0);
  date.setUTCSeconds(0);
  date.setUTCMilliseconds(0);

  return date.getTime();
}

/** @function timeFromFilePath
 * @param {string} path - file path that has a radar_datecode.pack file at the end
 * @return {number} - timestamp corresponding to the files name
 */
export function timeFromFilePath(path) {
  const fileName = path.substring(path.length - 20, path.length);
  return timeFromDateCode(
    fileName.match(/\d+/g).reduce((acc, char) => (acc += char), "")
  ).getTime();
}
