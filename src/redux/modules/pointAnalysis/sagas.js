import { call, put, select, all } from "redux-saga/effects";
import * as Location from "expo-location";

import * as T from "./types";
import { REQ } from "../watchedRequests";
import { makeUrl } from "./helpers";

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
    // Note that a lat or lon of exactly 0.000000 is also bad. 0:0 is "Null
    // Island" in Africa. No smhi data to be found there :)
    console.warn("Latitude or Longitude is bad, cannot fetch point analysis");
    yield put({ type: T.POINT_ANALYSIS_FAIL });
    return;
  }

  yield all([
    call(fetchPointAnalysis, lat, lon),
    call(fetchPointForecast, lat, lon),
  ]);
}

export function* fetchPointAnalysis(lat, lon) {
  yield put({ type: T.POINT_ANALYSIS });
  const url = makeUrl(lat, lon, false);

  yield put({
    type: REQ,
    url,
    successSaga: function*(resData) {
      let data = null;
      try {
        data = JSON.parse(resData);
      } catch (e) {
        console.warn("Error when parsing point analysis as json", e);
        yield put({ type: T.POINT_ANALYSIS_FAIL });
        return;
      }

      yield put({ type: T.POINT_ANALYSIS_SUCCESS, data });
    },
    failSaga: function*(data, e) {
      console.warn("Error when fetching point analysis", url, e);
      yield put({ type: T.POINT_ANALYSIS_FAIL });
      return;
    },
  });
}

export function* fetchPointForecast(lat, lon) {
  yield put({ type: T.FORECAST_POINT_ANALYSIS });
  const url = makeUrl(lat, lon, true);
  yield put({
    type: REQ,
    url,
    successSaga: function*(resData) {
      let data = null;
      try {
        data = JSON.parse(resData);
      } catch (e) {
        console.warn("Error when parsing point analysis as json", e);
        yield put({ type: T.FORECAST_POINT_ANALYSIS_FAIL });
        return;
      }

      yield put({ type: T.FORECAST_POINT_ANALYSIS_SUCCESS, data });
    },
    failSaga: function*(data, e) {
      console.warn("Error when fetching point analysis", url, e);
      yield put({ type: T.FORECAST_POINT_ANALYSIS_FAIL });
      return;
    },
  });
}
