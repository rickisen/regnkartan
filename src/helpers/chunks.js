import { begginingOfHour } from "./time";
import { timeFromFilePath } from "./dateCode";

/** packHoursIntoChunks
 * @param {Array} requestedHours - hours to put in the chunks, (should be an array of timestamps for begining at an hour)
 * @param {Object} chunks - chunks object, with timestamp for key
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

  let chunkKey = null;
  const lastChunkKey = sortedChunkKeys[sortedChunkKeys.length - 1];
  if (
    sortedChunkKeys.length > 0 &&
    hoursNotInAChunk[0] < parseInt(sortedChunkKeys[0])
  ) {
    chunkKey = parseInt(sortedChunkKeys[0]) - chunkSize;
  } else if (
    sortedChunkKeys.length > 0 &&
    hoursNotInAChunk[0] > parseInt(lastChunkKey)
  ) {
    chunkKey = parseInt(lastChunkKey) + chunks[lastChunkKey].chunkSize;
  } else if (sortedChunkKeys.length === 0) {
    chunkKey = begginingOfHour() - chunkSize;
  }

  let newChunks = {};
  if (chunkKey) {
    newChunks = {
      ...chunks,
      ["" + chunkKey]: {
        status: "qued",
        unpackedFiles: [],
        chunkSize,
      },
    };
  }

  // recurse
  return packHoursIntoChunks(hoursNotInAChunk, newChunks, chunkSize, ++depth);
}

/** filterOutChunk - removes one chunk from chunks
 * @param {object} chunks
 * @param {string} key - key of chunk to remove
 * @return {object} reduced chunks
 */
export function filterOutChunk(chunks, key) {
  let ret = {};
  for (var chunk in chunks) {
    if (chunk !== key) ret = { ...ret, [chunk]: chunks[chunk] };
  }
  return ret;
}

/** chunksFromFiles - Used to generate tracked chunks from cached files, has a hardcoded chunkSize of 1 hour
 * @param {array[string]} files, array of filepaths, should only contain .png entries with datecodes in name
 */
export function chunksFromFiles(files = []) {
  return files
    .sort()
    .map(f => ({
      key: begginingOfHour(new Date(timeFromFilePath(f))) + "",
      unpackedFiles: [f],
    }))
    .reduce(
      (acc, next) => ({
        ...acc,
        [next.key]: {
          ...acc[next.key],
          status: "unpacked",
          chunkSize: 1000 * 60 * 60,
          complete: acc[next.key] && acc[next.key].unpackedFiles.length == 11, // since chunkSize is hardcoded we know how many should fit (12)
          unpackedFiles: [
            ...(acc[next.key] ? acc[next.key].unpackedFiles : []),
            ...next.unpackedFiles,
          ],
        },
      }),
      {}
    );
}
