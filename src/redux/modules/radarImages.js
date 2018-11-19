import { call, put } from "redux-saga/effects";

/** ACTION TYPES **/
export const NAME = "regnkartan/smhi/images";
export const FETCH_DAY = `${NAME}/FETCH_DAY`;
export const FETCH_DAY_SUCCESS = `${NAME}/FETCH_DAY_SUCCESS`;
export const FETCH_DAY_FAIL = `${NAME}/FETCH_DAY_FAIL`;

const API_URL =
  "https://opendata-download-radar.smhi.se/api/version/latest/area/sweden/product/comp/";

/** SAGAS **/
export function* fetchDay({ day }) {
  let dd = day.getDate();
  let mm = day.getMonth() + 1; // January is 0!
  let yyyy = day.getFullYear();
  try {
    const r = yield call(() =>
      fetch(API_URL + `${yyyy}/${mm}/${dd}` + "/?format=png").then(r =>
        r.json()
      )
    );
    yield put({ type: FETCH_DAY_SUCCESS, files: r.files });
  } catch (e) {
    console.log(e);
    yield dispatch({ type: FETCH_DAY_FAIL, error: e });
  }
}

/** REDUCER **/
export default function reducer(
  state = {
    error: null,
    loadingDay: false,
    files: [],
  },
  action
) {
  switch (action.type) {
    case FETCH_DAY:
      return {
        ...state,
        error: null,
        loadingDay: true,
      };
    case FETCH_DAY_SUCCESS:
      return {
        ...state,
        error: null,
        loadingDay: false,
        files: [...state.files, ...action.files],
      };
    case FETCH_DAY_FAIL:
      return {
        ...state,
        error: action.error,
        loadingDay: false,
      };
    default:
      return state;
  }
}
