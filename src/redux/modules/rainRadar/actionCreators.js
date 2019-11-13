import { generateDateCode } from "../../../helpers";
import { SELECT_FILE, SELECT_HOUR } from "../timeSelection";

export function registerHour(hourStamp) {
  return { type: SELECT_HOUR, hourStamp };
}

export function registerTime(chunks, stamp) {
  let uri = null;
  const dateCode = generateDateCode(stamp, true, true);
  const hourDateCode = generateDateCode(stamp, true);
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
      if (!uri) {
        const alternatives = chunk.unpackedFiles.filter(p =>
          p.includes(hourDateCode)
        );
        // Length condtion is simple fix for rewind stutter when random pngs drop
        if (alternatives.length === 1) {
          uri = alternatives[0];
        }
      }
    }
  }
  return { type: SELECT_FILE, uri, stamp, dateCode };
}
