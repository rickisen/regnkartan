import {
  incrementsOfSixHours,
  generateDateCode,
  beginningOfDay,
  timeFromFilePath,
} from "../../../helpers";

/**
 * @param {Number} now - time for now
 * @param {Object} chunks
 * @param {[Number]} requestedHours
 * @return {Object} chunks
 */
export function makeChunks(
  time = Date.now(),
  chunks = {},
  requestedHours = [],
  files = []
) {
  const day = beginningOfDay(time);
  const yesterday = day - 1000 * 60 * 60 * 24;
  const tomorrow = day + 1000 * 60 * 60 * 24;
  const dayAfterTomorrow = day + 1000 * 60 * 60 * 24 * 2;

  const chunksForYesterday = generateChunksForDay(yesterday);
  const chunksForToday = generateChunksForDay(day);
  const chunksForTomorrow = generateChunksForDay(tomorrow, 1000 * 60 * 60 * 24);
  const chunksForDayAfterTomorrow = generateChunksForDay(
    dayAfterTomorrow,
    1000 * 60 * 60 * 24
  );

  const newChunks = {
    ...chunksForYesterday,
    ...chunksForToday,
    ...chunksForTomorrow,
    ...chunksForDayAfterTomorrow,
    ...chunks,
  };

  // Register supplied files
  for (const file of files) {
    const key = chunkForTime(timeFromFilePath(file), newChunks);
    if (key) {
      if (!newChunks[key].unpackedFiles.includes(file)) {
        newChunks[key].unpackedFiles = [...newChunks[key].unpackedFiles, file];
        newChunks[key].status = "unpacked";
        //TODO: this implies that all files are unpacked. might cause bug with partially downloaded cached packs
      }
    }
  }

  // Que requestedHours
  for (const hour of requestedHours) {
    const key = chunkForTime(hour, newChunks);
    if (key && newChunks[key].status === "on-hold") {
      newChunks[key].status = "qued";
    }
  }

  return newChunks;
}

/**
 * @param {number} time
 * @return {string} url
 */
export function apiUrl(time, latest = false) {
  const dateCode = generateDateCode(incrementsOfSixHours(time), true);
  const base = "https://qwert.fra1.digitaloceanspaces.com";
  return latest ? `${base}/latest.pack` : `${base}/radar_${dateCode}.pack`;
}

/**
 * @param {Number} time or "hour"
 * @param {Object} chunks
 * @return {string} chunkKey
 */
export function chunkForTime(time, chunks = {}) {
  for (const chunkKey of Object.keys(chunks)) {
    const beginningOfChunk = parseInt(chunkKey);
    const endOfChunk = beginningOfChunk + chunks[chunkKey].chunkSize;
    if (time >= beginningOfChunk && time < endOfChunk) {
      return chunkKey;
    }
  }
}

/**
 * @param {number} startOfDay - timestamp for 00:00 of the day in question
 * @param {number} chunkSize - size of each chunk
 * @return {Object} chunks - for that day
 */
export function generateChunksForDay(
  startOfDay,
  chunkSize = 1000 * 60 * 60 * 6
) {
  let chunks = {};
  let iter = startOfDay;
  const end = startOfDay + 1000 * 60 * 60 * 24;
  while (iter < end) {
    chunks["" + iter] = {
      chunkSize,
      status: "on-hold",
      unpackedFiles: [],
    };
    iter += chunkSize;
  }
  return chunks;
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
