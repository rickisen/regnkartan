import { PropTypes } from "prop-types";
import { call, put, select } from "redux-saga/effects";
import * as Location from "expo-location";

import { req } from "../../../helpers/binaryRequest";
export * from "./selectors";

/** ACTION TYPES **/
export const NAME = "regnkartan/pointAnalysis";
export const POINT_ANALYSIS = `${NAME}/POINT_ANALYSIS`;
export const POINT_ANALYSIS_SUCCES = `${NAME}/POINT_ANALYSIS_SUCCES`;
export const POINT_ANALYSIS_FAIL = `${NAME}/POINT_ANALYSIS_FAIL`;
export const SET_LAT_LON = `${NAME}/SET_LAT_LON`;
export const EXTENDED_DATA_VISIBLE = `${NAME}/EXTENDED_DATA_VISIBLE`;

const API = "https://opendata-download-metanalys.smhi.se";

function makeUrl(lat, lon) {
  return `${API}/api/category/mesan1g/version/2/geotype/point/lon/${lon.toFixed(
    6
  )}/lat/${lat.toFixed(6)}/data.json`;
}

/** Sagas **/
export function* getLocation() {
  const hasPermission = yield select(({ permissions: { granted } }) =>
    granted.includes("LOCATION")
  );
  if (!hasPermission) {
    return;
  }

  try {
    const {
      coords: { latitude, longitude },
    } = yield call(Location.getCurrentPositionAsync, {
      accuracy: Location.Accuracy.Lowest,
    });
    yield put({ type: SET_LAT_LON, lat: latitude, lon: longitude });
  } catch (e) {
    console.warn("Failed to get lat and lon", e);
    return;
  }
}

export function* fetchPoint() {
  const [lat, lon] = yield select(({ pointAnalysis: { lat, lon } }) => [
    lat,
    lon,
  ]);

  if (!lat || !lon) {
    console.warn("Latitude or Longitude is 0, cannot fetch point analysis");
    yield put({ type: POINT_ANALYSIS_FAIL });
    return;
  }

  let res = null;
  yield put({ type: POINT_ANALYSIS });
  const url = makeUrl(lat, lon);
  try {
    res = yield call(req, url);
  } catch (e) {
    console.warn("Error when fetching point analysis", url, res, e);
    yield put({ type: POINT_ANALYSIS_FAIL });
    return;
  }

  let data = null;
  try {
    data = JSON.parse(res);
  } catch (e) {
    console.warn("Error when parsing point analysis as json", e);
    yield put({ type: POINT_ANALYSIS_FAIL });
    return;
  }

  yield put({ type: POINT_ANALYSIS_SUCCES, data });
}

/** PropTypes **/
export const propTypes = {
  lat: PropTypes.number,
  lon: PropTypes.number,
  data: PropTypes.object,
};

/** REDUCER **/
const initialState = {
  lat: 0,
  long: 0,
  data: null,
  visible: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case POINT_ANALYSIS:
      return {
        ...state,
        isLoading: true,
      };
    case POINT_ANALYSIS_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case POINT_ANALYSIS_SUCCES:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case SET_LAT_LON:
      return {
        ...state,
        lat: action.lat,
        lon: action.lon,
      };
    case EXTENDED_DATA_VISIBLE:
      return {
        ...state,
        visible: action.visible,
      };
    default:
      return state;
  }
}
