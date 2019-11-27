import { call, put, select, delay, all, take, race } from "redux-saga/effects";
import * as FileSystem from "expo-file-system";

import unpack from "../../sagas/unpack";
import { incrementsOfSixHours, timeFromFilePath } from "../../../helpers";
import { REQ } from "../watchedRequests";
import { apiUrl, makeChunks } from "./helpers.js";
import * as T from "./types";

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
    .filter(file => file.includes(".png") && file.includes("radar_"))
    .map(f => FileSystem.cacheDirectory + f);

  const chunks = yield select(({ rainRadar: { chunks } }) => chunks);
  const newChunks = makeChunks(Date.now(), chunks, [], pngFiles);
  yield put({ type: T.REGISTER_CHUNKS, chunks: newChunks });
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
      file.includes("pmean") ||
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
  const chunks = yield select(({ rainRadar: { chunks } }) => chunks);

  const quedChunks = Object.keys(chunks).reduce(
    (acc, chunkKey) =>
      chunks[chunkKey].status === "qued" ? [...acc, chunkKey] : acc,
    []
  );

  if (quedChunks.length === 0) {
    return;
  }

  // Following code is written so we dont try to fetch more than 3 chunks at a
  // time, which should be avoided in most react-native enviorments, at least
  // when dealing with "big" files.

  // first make a two dimensional array with a maximum of 3 entries on the
  // first dimension. like so: [["1", "2", "3"], ["4", "5"]]
  const bunchOfChunks = quedChunks.reduce(
    (acc, next) => {
      if (acc[acc.length - 1].length > 2) {
        acc.push([next]);
      } else {
        acc[acc.length - 1].push(next);
      }
      return acc;
    },
    [[]]
  );

  // Runs fetchChunk for every "bunch" of chunks, and waits until the whole bunch
  // is fetched (or failed) until scheduling the next bunch. (or until 10
  // seconds have passed, in the case of network weirdness happening)
  try {
    for (var i = 0, len = bunchOfChunks.length; i < len; i++) {
      const concurrentReqs = bunchOfChunks[i];
      yield all(
        concurrentReqs.map(key => call(fetchChunk, chunks[key], parseInt(key)))
      );
      if (i !== len - 1) {
        let count = 0;
        yield race([
          delay(10000),
          take(
            ({ type }) =>
              type === (T.FETCH_CHUNK_SUCCESS || T.FETCH_CHUNK_FAIL) &&
              concurrentReqs.length === ++count
          ),
        ]);
      }
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
export function* fetchChunk(chunk, time) {
  if (!time || typeof time !== "number") {
    console.error(
      "fetch chunk needs a valid chunk with a time prop got: ",
      time
    );
    return;
  }

  const url = apiUrl(time);

  yield put({ type: T.FETCH_CHUNK, time, url });
  yield put({
    type: REQ,
    url,
    successSaga: function*(data) {
      yield put({ type: T.FETCH_CHUNK_SUCCESS, url, time });
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
    },
    failSaga: function*(data, error) {
      yield put({ type: T.FETCH_CHUNK_FAIL, url, error, time });
      console.warn("Error occured when fetching pack", time, url, data);
      return;
    },
  });
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
  const newChunks = makeChunks(Date.now(), chunks, requestedHours, []);

  yield put({ type: T.REGISTER_CHUNKS, chunks: newChunks });
}

export function* refreshLatest() {
  const url = apiUrl(0, true);
  const time = incrementsOfSixHours();

  yield put({
    type: REQ,
    url,
    successSaga: function*(data) {
      yield put({ type: T.FETCH_CHUNK_SUCCESS, url, time });
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
    },
    failSaga: function*(data, error) {
      yield put({ type: T.FETCH_CHUNK_FAIL, url, error, time });
      console.warn("Error occured when fetching latest pack", time, url, data);
      return;
    },
  });
}
