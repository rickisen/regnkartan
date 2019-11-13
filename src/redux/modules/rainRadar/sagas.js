import { call, put, select, fork } from "redux-saga/effects";
import * as FileSystem from "expo-file-system";

import unpack from "../../sagas/unpack";
import { req, begginingOfHour, timeFromFilePath } from "../../../helpers";
import { apiUrl, packHoursIntoChunks, chunksFromFiles } from "./helpers.js";
import { SELECT_HOUR } from "../timeSelection";
import * as T from "./types";

const DEFAULT_CHUNKSIZE = 1000 * 60 * 60 * 6;

export function* scanCachedFiles() {
  let files = [];
  try {
    files = yield call(
      FileSystem.readDirectoryAsync,
      FileSystem.cacheDirectory
    );
  } catch (e) {
    console.error("something went wrong when listing cached files: ", e);
  }

  const pngFiles = files
    .filter(file => file.includes(".png"))
    .map(f => FileSystem.cacheDirectory + f);

  const chunks = chunksFromFiles(pngFiles);
  yield put({ type: T.REGISTER_CHUNKS, chunks });
}

/** @generator clearCache - saga that clears all pack and png files in our cache
 * @param {number} - clear everything before this timestamp
 * directory */
export function* clearCache({ keepTil }) {
  let files = [];
  try {
    files = yield call(
      FileSystem.readDirectoryAsync,
      FileSystem.cacheDirectory
    );
  } catch (e) {
    console.error("something went wrong when listing cached files: ", e);
  }

  for (var i = 0, len = files.length; i < len; i++) {
    const file = files[i];
    if (
      file.includes("pack") ||
      (file.includes("png") && timeFromFilePath(file) < keepTil)
    ) {
      try {
        yield call(FileSystem.deleteAsync, FileSystem.cacheDirectory + file);
      } catch (e) {
        console.error(
          "something wen wrong when trying to delete a cached file ",
          e
        );
      }
    }
  }
}

/** @generator fetchQued - saga that fetches all chunks that are marked as
 * qued, designed to be run from a takeAll triggered by REGISTER_CHUNKS
 */
export function* fetchQued() {
  const registeredChunks = yield select(({ rainRadar: { chunks } }) => chunks);

  const quedChunks = Object.keys(registeredChunks).reduce(
    (acc, chunkKey) =>
      registeredChunks[chunkKey].status === "qued"
        ? {
            ...acc,
            [chunkKey]: registeredChunks[chunkKey],
          }
        : acc,
    {}
  );

  if (quedChunks.length === 0) {
    return;
  }

  // TODO: Add ability to cancel whilst fetching
  // TODO: fetch in order?
  try {
    for (var chunkKey in quedChunks) {
      yield fork(fetchChunk, quedChunks[chunkKey], parseInt(chunkKey));
    }
  } catch (e) {
    console.error("Something went wrong when fetching all qued chunks", e);
    yield put({ type: T.FETCH_QUED_FAIL, error: e });
    return;
  }

  yield put({ type: T.FETCH_QUED_SUCCESS });
}

/** @generator fetchChunk - saga that fetches a packed 'chunk' from the api.
 * @param {object} Chunk - Qued 'chunk' object that implements chunkSize
 * @param {number} time - key for the chunk
 */
export function* fetchChunk({ chunkSize }, time) {
  if (!time || typeof time !== "number") {
    console.error(
      "fetch chunk needs a valid chunk with a time prop got: ",
      time
    );
    return;
  }

  const url = apiUrl(time, chunkSize, true); // (time, chunkSize, false) for old api

  let status = null;
  let data = null;
  yield put({ type: T.FETCH_CHUNK, time, url });
  try {
    const response = yield call(req, url);
    status = response.status;
    data = response.data;
  } catch (e) {
    console.warn("Error occured when fetching pack", time, url, e);
    yield put({ type: T.FETCH_CHUNK_FAIL, error: status, time });
    return;
  }

  yield put({ type: T.FETCH_CHUNK_SUCCESS, time });

  yield put({ type: T.UNPACKING_CHUNK, time });
  try {
    yield call(unpack, data, time, [
      T.FETCH_CHUNK_FAIL,
      T.FETCH_CHUNK_SUCCESS,
      T.UNPACKING_CHUNK,
      T.UNPACKING_CHUNK_FAIL,
      T.UNPACKING_CHUNK_SUCCESS,
      T.UNPACKING_FILE_FAIL,
      T.UNPACKING_FILE_SUCCESS,
    ]);
  } catch (e) {
    console.warn("Error occured when unpacking chunk files", e, time);
    yield put({ type: T.UNPACKING_CHUNK_FAIL, error: e, time });
    return;
  }
}

/** @generator queRequestedHours - saga that puts new chunks into state.pack
 * that contains the hours listed as required in state.timeSelection.
 * meant to be called from a saga watching for SELECT_HOUR.
 */
export function* queRequestedHours() {
  const [requestedHours, chunks] = yield select(
    ({ timeSelection: { requestedHours }, rainRadar: { chunks } }) => [
      requestedHours,
      chunks,
    ]
  );
  const packedChunks = packHoursIntoChunks(
    requestedHours,
    chunks,
    DEFAULT_CHUNKSIZE
  );

  yield put({ type: T.REGISTER_CHUNKS, chunks: packedChunks });
}

export function* refreshLatest() {
  // change the size of the last chunk to be at the begining of its last image hour.
  try {
    const chunks = yield select(({ rainRadar: { chunks } }) => chunks);
    const keys = Object.keys(chunks).sort();
    const lastChunkKey = keys[keys.length - 1];
    const lastChunk = chunks[lastChunkKey];
    if (
      !lastChunk.unpackedFiles ||
      lastChunk.unpackedFiles.length === 0 ||
      lastChunk.complete === false
    ) {
      yield put({ type: T.RESET_CHUNK_STATUS, time: lastChunkKey });
      return;
    }

    const lastFileName = lastChunk.unpackedFiles.sort()[
      lastChunk.unpackedFiles.length - 1
    ];
    const lastFileStamp = timeFromFilePath(lastFileName);
    const beginingOfHourOfLastFile = begginingOfHour(new Date(lastFileStamp));
    const lastChunksNewSize = beginingOfHourOfLastFile - parseInt(lastChunkKey);

    const newChunks = {
      ...chunks,
      [lastChunkKey]: {
        ...lastChunk,
        chunkSize: lastChunksNewSize,
      },
    };

    yield put({ type: T.REGISTER_CHUNKS, chunks: newChunks });
    // add a new requestedHour (this hour)

    yield put({ type: SELECT_HOUR, hourStamp: beginingOfHourOfLastFile });
  } catch (e) {
    console.warn(
      "Something went wrong when trying to figure out where to refresh from"
    );
    yield put({ type: T.REFRESH_LATEST_FAIL });
    return;
  }
}
