import { call, put } from "redux-saga/effects";

import { generateDateCode } from "../../helpers/general";
import { unzipToBase64Files } from "../../helpers/zip";
import { urlToBlob } from "../../helpers/blob";

/** ACTION TYPES **/
export const NAME = "regnkartan/smhi/ZIP";
export const FETCH = `${NAME}/FETCH`;
export const FETCH_SUCCESS = `${NAME}/FETCH_SUCCESS`;
export const FETCH_FAIL = `${NAME}/FETCH_FAIL`;
export const UNZIPPING = `${NAME}/UNZIPPING`;
export const UNZIPPING_FAIL = `${NAME}/UNZIPPING_FAIL`;
export const UNZIPPING_SUCCESS = `${NAME}/UNZIPPING_SUCCESS`;

const API_URL =
  "http://regn.rickisen.com/zip/v1/";

/** SAGAS **/
export function* fetchZip({ date }) {
  if (!date) {
    console.error("fetch zip needs a valid date got: ", date);
    return
  }
  const dateCode = generateDateCode(date)

  let res = null
  try {
    res = yield call(urlToBlob, `${API_URL}radar_${dateCode}.zip`)
  } catch (e) {
    console.error("Error occured when fetching zip", e);
    yield put({ type: FETCH_FAIL, error: e });
    return
  }

  if (!res) {
    console.error("Failed to get zip from api, res: ", res);
    return
  }

  yield put({ type: FETCH_SUCCESS });

  yield put({ type: UNZIPPING });
  let unzippedFiles = []
  try {
    unzippedFiles = yield call(unzipToBase64Files, res)
  } catch (e) {
    console.error("Error occured when unzipping files", e);
    yield put({ type: UNZIPPING_FAIL, error: e });
    return
  }

  yield put({ type: UNZIPPING_SUCCESS, unzippedFiles });
}

/** REDUCER **/
export default function reducer(
  state = {
    error: null,
    loadingZip: false,
    unzipping: false,
    unzippedFiles: [],
  },
  action
) {
  switch (action.type) {
    case FETCH:
      return {
        ...state,
        error: null,
        loadingZip: true,
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        error: null,
        loadingZip: false,
      };
    case FETCH_FAIL:
      return {
        ...state,
        error: action.error,
        loadingZip: false,
      };
    case UNZIPPING:
      return {
        ...state,
        unzipping: true,
      };
    case UNZIPPING_FAIL:
      return {
        ...state,
        error: action.error,
        unzipping: false,
      };
    case UNZIPPING_SUCCESS:
      return {
        ...state,
        error: action.error,
        unzipping: false,
        unzippedFiles: action.unzippedFiles,
      };
    default:
      return state;
  }
}
