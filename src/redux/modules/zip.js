import { call, put } from "redux-saga/effects";

import { generateDateCode, sort_unique } from "../../helpers/general";
import { unzipToBase64Files } from "../../helpers/zip";
import { urlToBlob, urlToArrayBuffer } from "../../helpers/blob";

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

const API_URL =
  "http://regn.rickisen.com/zip/v1/";

/** SAGAS **/
export function* fetchRecent() {
  // Start is "now" since we want to fetch the chunks in reverse
  const start = new Date() // TODO: Round to nearest 5 minute increment
  const end = new Date(Date.now() - (1000 * 60 * 60 * 24)) // 24 hours ago
  const chunkSize = 1000 * 60 * 60 // 1 hour in miliseconds (for this api version)

  const chunks = []
  try {
    while (end.getTime() < start.getTime()) {
      chunks.push({
        time: new Date(start.getTime()),
        status: 'qued'
      })
      start.setTime(start.getTime() - chunkSize)
    }
  } catch (e) {
    console.error("Something went wrong when generating chunks", e);
    yield put({ type: FETCH_RECENT_FAIL, error: e })
    return
  }

  yield put({type: REGISTER_CHUNKS, chunks})

  // TODO: Add ability to cancel whilst fetching
  for (var i = 0, len = chunks.length; i < len; i++) {
    const chunk = chunks[i];
    yield call(fetchChunk, chunk)
  }
}

export function* fetchChunk({ time }) {
  if (!time) {
    console.error("fetch chunk needs a valid time got: ", time);
    return
  }
  const dateCode = generateDateCode(time, true)

  let res = null
  try {
    res = yield call(urlToArrayBuffer, `${API_URL}radar_${dateCode}.zip`)
  } catch (e) {
    console.warn("Error occured when fetching zip", e, time);
    yield put({ type: FETCH_CHUNK_FAIL, error: e, time });
    return
  }

  if (!res) {
    console.error("Failed to get zip chunk from api, res: ", res, time);
    return
  }

  yield put({ type: FETCH_CHUNK_SUCCESS, time });

  yield put({ type: UNZIPPING_CHUNK, time });
  let unzippedFiles = []
  try {
    unzippedFiles = yield call(unzipToBase64Files, res)
  } catch (e) {
    console.warn("Error occured when unzipping chunk files", e, time);
    yield put({ type: UNZIPPING_CHUNK_FAIL, error: e, time });
    return
  }

  yield put({ type: UNZIPPING_CHUNK_SUCCESS, unzippedFiles, time });
}

export function* fetchFullDay({ date }) {
  if (!date) {
    console.error("fetch full day zip needs a valid date got: ", date);
    return
  }
  const dateCode = generateDateCode(date)

  let res = null
  try {
    res = yield call(urlToArrayBuffer, `${API_URL}radar_${dateCode}.zip`)
  } catch (e) {
    console.error("Error occured when fetching zip", e);
    yield put({ type: FETCH_FULL_FAIL, error: e });
    return
  }

  if (!res) {
    console.error("Failed to get zip from api, res: ", res);
    return
  }

  yield put({ type: FETCH_FULL_SUCCESS });

  yield put({ type: UNZIPPING_FULL });
  let unzippedFiles = []
  try {
    unzippedFiles = yield call(unzipToBase64Files, res)
  } catch (e) {
    console.error("Error occured when unzipping files", e);
    yield put({ type: UNZIPPING_FULL_FAIL, error: e });
    return
  }

  yield put({ type: UNZIPPING_FULL_SUCCESS, unzippedFiles });
}

/** REDUCER **/
export default function reducer(
  state = {
    error: null,
    loadingZip: false,
    unzipping: false,
    chunks: [],
    unzippedFiles: [],
  },
  action
) {
  switch (action.type) {
    case REGISTER_CHUNKS:
      return {
        ...state,
        chunks: [ ...state.chunks, ...action.chunks ]
      };
    case FETCH_CHUNK:
      return {
        ...state,
        chunks: state.chunks.map((c) => c.time.getTime() === action.time.getTime() ? { ...c, status: 'loading' } : c ),
      };
    case FETCH_CHUNK_SUCCESS:
      return {
        ...state,
        chunks: state.chunks.map((c) => c.time.getTime() === action.time.getTime() ? { ...c, status: 'loaded' } : c ),
      };
    case FETCH_CHUNK_FAIL:
      return {
        ...state,
        chunks: state.chunks.map((c) => c.time.getTime() === action.time.getTime() ? { ...c, status: 'failed' } : c ),
      };
    case UNZIPPING_CHUNK:
      return {
        ...state,
        chunks: state.chunks.map((c) => c.time.getTime() === action.time.getTime() ? { ...c, status: 'unzipping' } : c ),
      };
    case UNZIPPING_CHUNK_FAIL:
      return {
        ...state,
        chunks: state.chunks.map((c) => c.time.getTime() === action.time.getTime() ? { ...c, status: 'unzip-fail' } : c ),
      };
    case UNZIPPING_CHUNK_SUCCESS:
      return {
        ...state,
        chunks: state.chunks.map((c) => c.time.getTime() === action.time.getTime() ? { ...c, status: 'unzipped' } : c ),
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
