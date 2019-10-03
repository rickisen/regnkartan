import { call, put, select, fork } from "redux-saga/effects";
import { PropTypes } from "prop-types";
import * as FileSystem from "expo-file-system";

import unpack from "../../sagas/unpack";
import {
  req,
  generateDateCode,
  packHoursIntoChunks,
  begginingOfHour,
  timeFromFilePath,
} from "../../../helpers";
import { SELECT_FILE, SELECT_HOUR } from "../radarSelection";

/** ACTION TYPES **/
export const NAME = "regnkartan/smhi/PACK";
export const FETCH_CHUNK = `${NAME}/FETCH_CHUNK`;
export const FETCH_CHUNK_SUCCESS = `${NAME}/FETCH_CHUNK_SUCCESS`;
export const FETCH_CHUNK_FAIL = `${NAME}/FETCH_CHUNK_FAIL`;
export const UNPACKING_CHUNK = `${NAME}/UNPACKING_CHUNK`;
export const UNPACKING_CHUNK_FAIL = `${NAME}/UNPACKING_CHUNK_FAIL`;
export const UNPACKING_CHUNK_SUCCESS = `${NAME}/UNPACKING_CHUNK_SUCCESS`;
export const UNPACKING_FILE_FAIL = `${NAME}/UNPACKING_FILE_FAIL`;
export const UNPACKING_FILE_SUCCESS = `${NAME}/UNPACKING_FILE_SUCCESS`;
export const FETCH_QUED_SUCCESS = `${NAME}/FETCH_QUED_SUCCESS`;
export const FETCH_QUED_FAIL = `${NAME}/FETCH_QUED_FAIL`;
export const REGISTER_CHUNKS = `${NAME}/REGISTER_CHUNKS`;
export const CLEAR_CACHE = `${NAME}/CLEAR_CACHE`;
export const REFRESH_LATEST = `${NAME}/REFRESH_LATEST`;
export const REFRESH_LATEST_FAIL = `${NAME}/REFRESH_LATEST_FAIL`;
export const RESET_CHUNK_STATUS = `${NAME}/RESET_CHUNK_STATUS`;

const DEFAULT_CHUNKSIZE = 1000 * 60 * 60 * 8;
const API_URL = "http://regn.rickisen.com/zip/v1/";
// const API_URL = "http://desktop.lan:8000/v1/";

/** SAGAS **/
/** @generator clearCache - saga that clears all pack and png files in our cache
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
    if (file.includes("pack") || file.includes("png")) {
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
  const registeredChunks = yield select(
    ({ wheatherData: { chunks } }) => chunks
  );
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
    yield put({ type: FETCH_QUED_FAIL, error: e });
    return;
  }

  yield put({ type: FETCH_QUED_SUCCESS });
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
  const dateCode = generateDateCode(time, true);

  const chunkSizeQuery = `?end=${generateDateCode(time + chunkSize, true)}`;

  let res = null;
  const url = `${API_URL}radar_${dateCode}.pack${chunkSizeQuery || ""}`;
  yield put({ type: FETCH_CHUNK, time, url });
  try {
    res = yield call(req, url);
  } catch (e) {
    console.warn("Error occured when fetching pack", e, time, url);
    yield put({ type: FETCH_CHUNK_FAIL, error: e, time });
    return;
  }

  if (!res) {
    console.error("Failed to get pack chunk from api", time);
    yield put({ type: FETCH_CHUNK_FAIL, error: "unknown", time });
    return;
  }

  yield put({ type: FETCH_CHUNK_SUCCESS, time });

  yield put({ type: UNPACKING_CHUNK, time });
  try {
    yield call(unpack, res, time, [
      FETCH_CHUNK_FAIL,
      FETCH_CHUNK_SUCCESS,
      UNPACKING_CHUNK,
      UNPACKING_CHUNK_FAIL,
      UNPACKING_CHUNK_SUCCESS,
      UNPACKING_FILE_FAIL,
      UNPACKING_FILE_SUCCESS,
    ]);
  } catch (e) {
    console.warn("Error occured when unpacking chunk files", e, time);
    yield put({ type: UNPACKING_CHUNK_FAIL, error: e, time });
    return;
  }
}

/** @generator queRequestedHours - saga that puts new chunks into state.pack
 * that contains the hours listed as required in state.radarSelection.
 * meant to be called from a saga watching for SELECT_HOUR.
 */
export function* queRequestedHours() {
  const [requestedHours, chunks] = yield select(
    ({ radarSelection: { requestedHours }, wheatherData: { chunks } }) => [
      requestedHours,
      chunks,
    ]
  );
  const packedChunks = packHoursIntoChunks(
    requestedHours,
    chunks,
    DEFAULT_CHUNKSIZE
  );
  yield put({ type: REGISTER_CHUNKS, chunks: packedChunks });
}

export function* refreshLatest() {
  // change the size of the last chunk to be at the begining of its last image hour.
  try {
    const chunks = yield select(({ wheatherData: { chunks } }) => chunks);
    const keys = Object.keys(chunks).sort();
    const lastChunkKey = keys[keys.length - 1];
    const lastChunk = chunks[lastChunkKey];
    if (!lastChunk.unpackedFiles || lastChunk.unpackedFiles.length === 0) {
      yield put({ type: RESET_CHUNK_STATUS, time: lastChunkKey });
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

    yield put({ type: REGISTER_CHUNKS, chunks: newChunks });
    // add a new requestedHour (this hour)

    yield put({ type: SELECT_HOUR, hourStamp: beginingOfHourOfLastFile });
  } catch (e) {
    console.warn(
      "Something went wrong when trying to figure out where to refresh from"
    );
    yield put({ type: REFRESH_LATEST_FAIL });
    return;
  }
}

/** ActionCreators **/
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

/** Selectors **/
export function allChunks({ wheatherData: { chunks } }) {
  return chunks;
}

export function allChunksDone({ wheatherData: { chunks } }) {
  for (var stamp in chunks) {
    if (
      chunks[stamp].status !== "unpacked" &&
      chunks[stamp].status !== "unpack-fail" &&
      chunks[stamp].status !== "failed"
    ) {
      return false;
    }
  }
  return true;
}

/** PropTypes **/
export const propTypes = {
  error: PropTypes.bool,
  loadingPack: PropTypes.bool,

  unpacking: PropTypes.bool,
  chunks: PropTypes.shape({
    [PropTypes.string]: PropTypes.shape({
      status: PropTypes.oneOf([
        "loading",
        "loaded",
        "failed",
        "unpacking",
        "unpack-fail",
        "unpacked",
      ]),
      unpackedFiles: PropTypes.arrayOf(PropTypes.string),
      chunkSize: PropTypes.number,
    }),
  }),
};

/** REDUCER **/
const initialState = {
  error: null,
  loadingPack: false,
  unpacking: false,
  chunks: {},
};

export default function reducer(state = initialState, action) {
  // console.log("action", action.type, action.time || "");
  // console.log("state", state);
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
    case UNPACKING_CHUNK:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{ status: "unpacking" },
          },
        },
      };
    case UNPACKING_CHUNK_FAIL:
      return {
        ...state,
        chunks: {
          ...Object.keys(state.chunks)
            .filter(k => parseInt(k) !== action.time)
            .reduce((acc, k) => {
              acc[k] = state.chunks[k];
              return acc;
            }, {}),
        },
      };
    case UNPACKING_FILE_SUCCESS:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{
              unpackedFiles: [
                ...state.chunks[action.time].unpackedFiles,
                action.uri,
              ],
            },
          },
        },
      };
    case UNPACKING_CHUNK_SUCCESS:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{ status: "unpacked" },
          },
        },
      };
    case RESET_CHUNK_STATUS:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{ status: "qued" },
          },
        },
      };
    default:
      return state;
  }
}
