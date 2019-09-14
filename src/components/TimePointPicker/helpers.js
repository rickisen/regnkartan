import { generateDateCodeRange, timeFromDateCode } from "../../helpers/general";

export function statusToColor(status) {
  switch (status) {
    case "qued":
      return "#777";
    case "loading":
      return "#555";
    case "loaded":
      return "#222";
    case "failed":
      return "#a00";
    case "unpacking":
      return "#111";
    case "unpacked":
      return "#000";
    case "unpack-fail":
      return "#a0a";
    case "future":
      return "#aaa";
    default:
      return "#aaa";
  }
}

/** @function chunkStatusForHour
 * @param {number} hour - timestamp of the hour to check
 * @param {object} chunks - object holding the chunks to test against
 * @return {string} status, might be empty string
 */
export function chunkStatusForHour(hour, chunks) {
  if (!hour && !chunks) {
    return "";
  }

  for (var stamp in chunks) {
    const beginingOfChunk = parseInt(stamp);
    const endOfChunk = beginingOfChunk + chunks[stamp].chunkSize;
    if (hour >= beginingOfChunk && hour < endOfChunk) {
      return chunks[stamp].status;
    }
  }
  return "";
}

/** @function fileStatusForHour
 * @param {number} hour - timestamp of the hour to check
 * @param {object} chunks - object holding the chunks to test against
 * @return {[number]} - an array containing a timestamp for every minute that has an unpacked file
 */
export function fileStatusForHour(hour, chunks) {
  let ret = [];

  if (typeof hour === "number" && typeof chunks === "object") {
    const endOfHour = hour + 1000 * 60 * 60;
    for (var stamp in chunks) {
      const beginingOfChunk = parseInt(stamp);
      const endOfChunk = beginingOfChunk + chunks[stamp].chunkSize;
      const files = chunks[stamp].unpackedFiles;
      const status = chunks[stamp].status;
      if (
        hour >= beginingOfChunk &&
        hour < endOfChunk &&
        status === "unpacked" &&
        files.length > 0
      ) {
        ret = generateDateCodeRange(hour, endOfHour).reduce(
          (acc, dateCode) =>
            files.reduce((acc, next) => acc || next.includes(dateCode), false)
              ? [...acc, timeFromDateCode(dateCode).getTime()]
              : acc,
          []
        );
      }
    }
  }

  return ret;
}
