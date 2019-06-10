import { call, put } from "redux-saga/effects";
import { PropTypes } from "prop-types";

import { unzipToBase64Files } from "../../helpers/zip";
import { req } from "../../helpers/binaryRequest";
import {
  generateDateCode,
  sort_unique,
  incrementsOfFive,
  generateDateCodeRange,
} from "../../helpers/general";

/** ACTION TYPES **/
export const NAME = "regnkartan/smhi/ZIP";
export const FETCH_FULL = `${NAME}/FETCH_FULL`;
export const FETCH_FULL_SUCCESS = `${NAME}/FETCH_FULL_SUCCESS`;
export const FETCH_FULL_FAIL = `${NAME}/FETCH_FULL_FAIL`;
export const UNZIPPING_FULL = `${NAME}/UNZIPPING_FULL`;
export const UNZIPPING_FULL_FAIL = `${NAME}/UNZIPPING_FULL_FAIL`;
export const UNZIPPING_FULL_SUCCESS = `${NAME}/UNZIPPING_FULL_SUCCESS`;
export const FETCH_CHUNK = `${NAME}/FETCH_CHUNK`;
export const FETCH_CHUNK_SUCCESS = `${NAME}/FETCH_CHUNK_SUCCESS`;
export const FETCH_CHUNK_FAIL = `${NAME}/FETCH_CHUNK_FAIL`;
export const UNZIPPING_CHUNK = `${NAME}/UNZIPPING_CHUNK`;
export const UNZIPPING_CHUNK_FAIL = `${NAME}/UNZIPPING_CHUNK_FAIL`;
export const UNZIPPING_CHUNK_SUCCESS = `${NAME}/UNZIPPING_CHUNK_SUCCESS`;
export const FETCH_RECENT = `${NAME}/FETCH_RECENT`;
export const FETCH_RECENT_SUCCESS = `${NAME}/FETCH_RECENT_SUCCESS`;
export const FETCH_RECENT_FAIL = `${NAME}/FETCH_RECENT_FAIL`;
export const UNZIPPING_RECENT = `${NAME}/UNZIPPING_RECENT`;
export const UNZIPPING_RECENT_FAIL = `${NAME}/UNZIPPING_RECENT_FAIL`;
export const UNZIPPING_RECENT_SUCCESS = `${NAME}/UNZIPPING_RECENT_SUCCESS`;
export const REGISTER_CHUNKS = `${NAME}/REGISTER_CHUNKS`;
export const SELECT_RANGE = `${NAME}/SELECT_RANGE`;

const API_URL = "http://regn.rickisen.com/zip/v1/";
// const API_URL = "http://desktop:8000/v1/";

/** SAGAS **/

/** @generator fetchRecent - fetches last 12 hours of image data in chunks */
export function* fetchRecent() {
  const end = new Date();
  end.setMinutes(incrementsOfFive(end.getMinutes()));
  const start = new Date(end.getTime() - 1000 * 60 * 60 * 12); // 12 hours ago
  const chunkSize = 1000 * 60 * 60 * 3; // 3 hours

  yield put({ type: SELECT_RANGE, start, end });

  const chunks = [];
  const current = new Date(end.getTime());
  try {
    while (start.getTime() < current.getTime()) {
      chunks.push({
        time: new Date(current.getTime()),
        status: "qued",
        chunkSize,
      });
      current.setTime(current.getTime() - chunkSize);
    }
  } catch (e) {
    console.error("Something went wrong when generating chunks", e);
    yield put({ type: FETCH_RECENT_FAIL, error: e });
    return;
  }

  yield put({ type: REGISTER_CHUNKS, chunks });

  // TODO: Add ability to cancel whilst fetching
  for (var i = 0, len = chunks.length; i < len; i++) {
    const chunk = chunks[i];
    yield call(fetchChunk, chunk);
  }
}

/** @generator fetchChunk - saga that fetches a zipped 'chunk' from the api.
 * @param {object} Chunk - Qued 'chunk' object that implements time property and chunkSize
 */
export function* fetchChunk({ time, chunkSize }) {
  if (!time) {
    console.error(
      "fetch chunk needs a valid chunk with a time prop got: ",
      time
    );
    return;
  }
  const dateCode = generateDateCode(time, true);

  const chunkSizeQuery = `?end=${generateDateCode(
    new Date(time.getTime() + chunkSize),
    true
  )}`;

  let res = null;
  try {
    res = yield call(
      req,
      `${API_URL}radar_${dateCode}.zip${chunkSizeQuery || ""}`,
      "arraybuffer"
    );
  } catch (e) {
    console.warn(
      "Error occured when fetching zip",
      e,
      time,
      `${API_URL}radar_${dateCode}.zip${chunkSizeQuery || ""}`
    );
    yield put({ type: FETCH_CHUNK_FAIL, error: e, time });
    return;
  }

  if (!res) {
    console.error("Failed to get zip chunk from api, res: ", res, time);
    return;
  }

  yield put({ type: FETCH_CHUNK_SUCCESS, time });

  yield put({ type: UNZIPPING_CHUNK, time });
  let unzippedFiles = [];
  try {
    unzippedFiles = yield call(unzipToBase64Files, res);
  } catch (e) {
    console.warn("Error occured when unzipping chunk files", e, time);
    yield put({ type: UNZIPPING_CHUNK_FAIL, error: e, time });
    return;
  }

  yield put({ type: UNZIPPING_CHUNK_SUCCESS, unzippedFiles, time });
}

export function* fetchFullDay({ date }) {
  if (!date) {
    console.error("fetch full day zip needs a valid date got: ", date);
    return;
  }
  const dateCode = generateDateCode(date);

  let res = null;
  try {
    // Would love to use a blob for this, but jszip doesn't like react-native blobs
    res = yield call(req, `${API_URL}radar_${dateCode}.zip`, "arraybuffer");
  } catch (e) {
    console.error("Error occured when fetching zip", e);
    yield put({ type: FETCH_FULL_FAIL, error: e });
    return;
  }

  if (!res) {
    console.error("Failed to get zip from api, res: ", res);
    return;
  }

  yield put({ type: FETCH_FULL_SUCCESS });

  yield put({ type: UNZIPPING_FULL });
  let unzippedFiles = [];
  try {
    unzippedFiles = yield call(unzipToBase64Files, res);
  } catch (e) {
    console.error("Error occured when unzipping files", e);
    yield put({ type: UNZIPPING_FULL_FAIL, error: e });
    return;
  }

  yield put({ type: UNZIPPING_FULL_SUCCESS, unzippedFiles });
}

export const propTypes = {
  error: PropTypes.bool,
  loadingZip: PropTypes.bool,
  unzipping: PropTypes.bool,
  chunks: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string,
      unzippedFiles: PropTypes.arrayOf(PropTypes.string),
      chunkSize: PropTypes.number,
    })
  ),
  unzippedFiles: PropTypes.arrayOf(PropTypes.string),
  selectedRange: PropTypes.shape({
    start: PropTypes.date,
    end: PropTypes.date,
    dateCodeRange: PropTypes.arrayOf(PropTypes.string),
  }),
};

const initialState = {
  error: null,
  loadingZip: false,
  unzipping: false,
  chunks: [],
  unzippedFiles: [],
  selectedRange: {
    start: null,
    end: null,
    dateCodeRange: [],
  },
};

/** REDUCER **/
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_RANGE:
      return {
        ...state,
        selectedRange: {
          start: action.start,
          end: action.end,
          dateCodeRange: generateDateCodeRange(action.start, action.end),
        },
      };
    case REGISTER_CHUNKS:
      return {
        ...state,
        chunks: [...state.chunks, ...action.chunks],
      };
    case FETCH_CHUNK:
      return {
        ...state,
        chunks: state.chunks.map(c =>
          c.time.getTime() === action.time.getTime()
            ? { ...c, status: "loading" }
            : c
        ),
      };
    case FETCH_CHUNK_SUCCESS:
      return {
        ...state,
        chunks: state.chunks.map(c =>
          c.time.getTime() === action.time.getTime()
            ? { ...c, status: "loaded" }
            : c
        ),
      };
    case FETCH_CHUNK_FAIL:
      return {
        ...state,
        chunks: state.chunks.map(c =>
          c.time.getTime() === action.time.getTime()
            ? { ...c, status: "failed" }
            : c
        ),
      };
    case UNZIPPING_CHUNK:
      return {
        ...state,
        chunks: state.chunks.map(c =>
          c.time.getTime() === action.time.getTime()
            ? { ...c, status: "unzipping" }
            : c
        ),
      };
    case UNZIPPING_CHUNK_FAIL:
      return {
        ...state,
        chunks: state.chunks.map(c =>
          c.time.getTime() === action.time.getTime()
            ? { ...c, status: "unzip-fail" }
            : c
        ),
      };
    case UNZIPPING_CHUNK_SUCCESS:
      return {
        ...state,
        chunks: state.chunks.map(c =>
          c.time.getTime() === action.time.getTime()
            ? { ...c, status: "unzipped" }
            : c
        ),
        unzippedFiles: sort_unique([
          ...action.unzippedFiles,
          ...state.unzippedFiles,
        ]),
      };
    case FETCH_FULL:
      return {
        ...state,
        error: null,
        loadingZip: true,
      };
    case FETCH_FULL_SUCCESS:
      return {
        ...state,
        error: null,
        loadingZip: false,
      };
    case FETCH_FULL_FAIL:
      return {
        ...state,
        error: action.error,
        loadingZip: false,
      };
    case UNZIPPING_FULL:
      return {
        ...state,
        unzipping: true,
      };
    case UNZIPPING_FULL_FAIL:
      return {
        ...state,
        error: action.error,
        unzipping: false,
      };
    case UNZIPPING_FULL_SUCCESS:
      return {
        ...state,
        error: action.error,
        unzipping: false,
        unzippedFiles: sort_unique([
          ...action.unzippedFiles,
          ...state.unzippedFiles,
        ]),
      };
    default:
      return state;
  }
}
