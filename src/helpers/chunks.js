import { begginingOfHour } from "./time";

/** packHoursIntoChunks
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
