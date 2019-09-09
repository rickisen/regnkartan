import { call, put, select, fork, take } from "redux-saga/effects";
import { PropTypes } from "prop-types";
import * as FileSystem from "expo-file-system";

import unzipChannel from "../sagas/unzipChannel";
import { req } from "../../helpers/binaryRequest";
import { generateDateCode, packHoursIntoChunks } from "../../helpers/general";

/** ACTION TYPES **/
export const NAME = "regnkartan/smhi/ZIP";
export const FETCH_CHUNK = `${NAME}/FETCH_CHUNK`;
export const FETCH_CHUNK_SUCCESS = `${NAME}/FETCH_CHUNK_SUCCESS`;
export const FETCH_CHUNK_FAIL = `${NAME}/FETCH_CHUNK_FAIL`;
export const UNZIPPING_CHUNK = `${NAME}/UNZIPPING_CHUNK`;
export const UNZIPPING_CHUNK_FAIL = `${NAME}/UNZIPPING_CHUNK_FAIL`;
export const UNZIPPING_CHUNK_SUCCESS = `${NAME}/UNZIPPING_CHUNK_SUCCESS`;
export const UNZIPPING_FILE_FAIL = `${NAME}/UNZIPPING_FILE_FAIL`;
export const UNZIPPING_FILE_SUCCESS = `${NAME}/UNZIPPING_FILE_SUCCESS`;
export const FETCH_QUED_SUCCESS = `${NAME}/FETCH_QUED_SUCCESS`;
export const FETCH_QUED_FAIL = `${NAME}/FETCH_QUED_FAIL`;
export const REGISTER_CHUNKS = `${NAME}/REGISTER_CHUNKS`;
export const CLEAR_CACHE = `${NAME}/CLEAR_CACHE`;

const API_URL = "http://regn.rickisen.com/zip/v1/";
// const API_URL = "http://desktop.lan:8000/v1/";

/** SAGAS **/
/** @generator clearCache - saga that clears all zip and png files in our cache
 * directory */
export function* clearCache() {
  let files = [];
  try {
    files = yield call(
      FileSystem.readDirectoryAsync,
      FileSystem.cacheDirectory
    );
  } catch (e) {
    console.error("something went wrong when listing cached files: ", e);
  }

  files.sort();

  for (var i = 0, len = files.length; i < len; i++) {
    const file = files[i];
    if (file.includes("zip") || file.includes("png")) {
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
  const registeredChunks = yield select(({ zip: { chunks } }) => chunks);
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

  // TODO: Add ability to cancel whilst fetching
  // TODO: fetch in order?
  try {
    for (var chunkKey in quedChunks) {
      yield fork(fetchChunk, quedChunks[chunkKey], parseInt(chunkKey));
    }
  } catch (e) {
    console.error("Something went wrong when fetching all qued chunks", e);
    yield put({ type: FETCH_QUED_FAIL, error: e });
    return;
  }

  yield put({ type: FETCH_QUED_SUCCESS });
}

/**
 * @generator unzipSaga - clears all zip and png files in our cache directory
 * @param {ArrayBuffer} zipData - zip file as array buffer
 * */
export function* unzipSaga(zipData, time) {
  const chan = yield call(unzipChannel, zipData);
  try {
    // while (true) loops work in a non blocking way inside generators don't
    // panic!
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      const { uri } = yield take(chan);
      yield put({ type: UNZIPPING_FILE_SUCCESS, uri, time });
    }
  } catch (e) {
    console.warn("Error occurred when unzipping a file", e);
    yield put({ type: UNZIPPING_FILE_FAIL, time });
  } finally {
    yield put({ type: UNZIPPING_CHUNK_SUCCESS, time }); // will this always succeed?
  }
}

/** @generator fetchChunk - saga that fetches a zipped 'chunk' from the api.
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
  const dateCode = generateDateCode(time, true);

  const chunkSizeQuery = `?end=${generateDateCode(time + chunkSize, true)}`;

  let res = null;
  const url = `${API_URL}radar_${dateCode}.zip${chunkSizeQuery || ""}`;
  yield put({ type: FETCH_CHUNK, time, url });
  try {
    res = yield call(req, url, "arraybuffer");
  } catch (e) {
    console.warn("Error occured when fetching zip", e, time, url);
    yield put({ type: FETCH_CHUNK_FAIL, error: e, time });
    return;
  }

  if (!res) {
    console.error("Failed to get zip chunk from api, res: ", res, time);
    return;
  }

  yield put({ type: FETCH_CHUNK_SUCCESS, time });

  yield put({ type: UNZIPPING_CHUNK, time });
  try {
    yield call(unzipSaga, res, time);
  } catch (e) {
    console.warn("Error occured when unzipping chunk files", e, time);
    yield put({ type: UNZIPPING_CHUNK_FAIL, error: e, time });
    return;
  }

  yield put({ type: UNZIPPING_CHUNK_SUCCESS, time });
}

/** @generator queRequestedHours - saga that puts new chunks into state.zip
 * that contains the hours listed as required in state.radarSelection.
 * meant to be called from a saga watching for SELECT_HOUR.
 */
export function* queRequestedHours() {
  const [requestedHours, chunks] = yield select(
    ({ radarSelection: { requestedHours }, zip: { chunks } }) => [
      requestedHours,
      chunks,
    ]
  );
  const packedChunks = packHoursIntoChunks(
    requestedHours,
    chunks,
    1000 * 60 * 60
  );
  yield put({ type: REGISTER_CHUNKS, chunks: packedChunks });
}

/** PropTypes **/
export const propTypes = {
  error: PropTypes.bool,
  loadingZip: PropTypes.bool,
  unzipping: PropTypes.bool,
  chunks: PropTypes.shape({
    [PropTypes.string]: PropTypes.shape({
      status: PropTypes.oneOf([
        "loading",
        "loaded",
        "failed",
        "unzipping",
        "unzip-fail",
        "unzipped",
      ]),
      unzippedFiles: PropTypes.arrayOf(PropTypes.string),
      chunkSize: PropTypes.number,
    }),
  }),
};

/** REDUCER **/
const initialState = {
  error: null,
  loadingZip: false,
  unzipping: false,
  chunks: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REGISTER_CHUNKS:
      return {
        ...state,
        chunks: { ...state.chunks, ...action.chunks },
      };
    case FETCH_CHUNK:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{ status: "loading" },
          },
        },
      };
    case FETCH_CHUNK_SUCCESS:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{ status: "loaded" },
          },
        },
      };
    case FETCH_CHUNK_FAIL:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{ status: "failed" },
          },
        },
      };
    case UNZIPPING_CHUNK:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{ status: "unzipping" },
          },
        },
      };
    case UNZIPPING_CHUNK_FAIL:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{ status: "unzip-fail" },
          },
        },
      };
    case UNZIPPING_FILE_SUCCESS:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{
              unzippedFiles: [
                ...state.chunks[action.time].unzippedFiles,
                action.uri,
              ],
            },
          },
        },
      };
    case UNZIPPING_CHUNK_SUCCESS:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{ status: "unzipped" },
          },
        },
      };
    default:
      return state;
  }
}
