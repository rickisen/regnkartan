import { takeEvery, call, put } from "redux-saga/effects";
import { SET_LAT_LON, fetchPoint, getLocation } from "../modules/pointAnalysis";
import {
  LOCATION_GRANTED,
  ASSERT_LOCATION,
  assertLocationPermission,
} from "../modules/permissions";
import { SELECT_HOUR } from "../modules/timeSelection";
import { fetchLightningIfNeeded } from "../modules/lightning";
import { REQ, req } from "../modules/watchedRequests";
import {
  REFRESH_LATEST,
  CLEAR_CACHE,
  REGISTER_CHUNKS,
  SCAN_CACHE,
  RESET_CHUNK_STATUS,
  refreshLatest,
  fetchQued,
  clearCache,
  scanCachedFiles,
  queRequestedHours,
} from "../modules/rainRadar";

export default function* rootSaga() {
  yield takeEvery(REGISTER_CHUNKS, fetchQued);
  yield takeEvery(CLEAR_CACHE, clearCache);
  yield takeEvery(SCAN_CACHE, scanCachedFiles);
  yield takeEvery(SELECT_HOUR, queRequestedHours);
  yield takeEvery(SELECT_HOUR, fetchLightningIfNeeded);
  yield takeEvery(ASSERT_LOCATION, assertLocationPermission);
  yield takeEvery(REFRESH_LATEST, refreshLatest);
  yield takeEvery(RESET_CHUNK_STATUS, fetchQued);
  yield takeEvery(LOCATION_GRANTED, getLocation);
  yield takeEvery(SET_LAT_LON, fetchPoint);
  yield takeEvery(REQ, req);
  yield call(Initialize);
}

function* Initialize() {
  yield call(clearCache, {
    keepTil: Date.now() - 1000 * 60 * 60 * 24, // removes anything older than 24 hours ago
    // keepTil: Date.now() + 1000 * 60 * 60 * 100,
  });
  yield call(scanCachedFiles);
  yield call(assertLocationPermission);
  yield put({ type: REFRESH_LATEST });
}
