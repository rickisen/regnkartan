import { call, put, select } from "redux-saga/effects";
import * as Location from "expo-location";

import * as T from "./types";
import { req } from "../../../helpers/binaryRequest";

const API = "https://opendata-download-metanalys.smhi.se";
function makeUrl(lat, lon) {
  return `${API}/api/category/mesan1g/version/2/geotype/point/lon/${lon.toFixed(
    6
  )}/lat/${lat.toFixed(6)}/data.json`;
}

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
    yield put({ type: T.SET_LAT_LON, lat: latitude, lon: longitude });
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
    yield put({ type: T.POINT_ANALYSIS_FAIL });
    return;
  }

  let res = null;
  yield put({ type: T.POINT_ANALYSIS });
  const url = makeUrl(lat, lon);
  try {
    res = yield call(req, url);
  } catch (e) {
    console.warn("Error when fetching point analysis", url, e);
    yield put({ type: T.POINT_ANALYSIS_FAIL });
    return;
  }

  let data = null;
  try {
    data = JSON.parse(res.data);
  } catch (e) {
    console.warn("Error when parsing point analysis as json", e);
    yield put({ type: T.POINT_ANALYSIS_FAIL });
    return;
  }

  yield put({ type: T.POINT_ANALYSIS_SUCCES, data });
}
