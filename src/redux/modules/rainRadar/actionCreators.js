import { generateDateCode } from "../../../helpers";
import { SELECT_FILE, SELECT_HOUR } from "../timeSelection";

export function registerHour(hourStamp) {
  return { type: SELECT_HOUR, hourStamp };
}

export function registerTime(chunks, stamp) {
  let uri = null;
  const dateCode = generateDateCode(stamp, true, true);
  for (var hour in chunks) {
    const chunk = chunks[hour];
    const chunkBegin = parseInt(hour);
    const chunkEnd = parseInt(hour) + chunk.chunkSize;

    if (
      chunk.status === "unpacked" &&
      stamp >= chunkBegin &&
      stamp < chunkEnd
    ) {
      uri = chunk.unpackedFiles.find(p => p.includes(dateCode));
    }
  }
  return { type: SELECT_FILE, uri, stamp, dateCode };
}
