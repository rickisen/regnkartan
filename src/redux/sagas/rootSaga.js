import { takeEvery } from "redux-saga/effects";
import { SET_LAT_LON, fetchPoint, getLocation } from "../modules/pointAnalysis";
import {
  LOCATION_GRANTED,
  ASSERT_LOCATION,
  assertLocationPermission,
} from "../modules/permissions";
import { SELECT_HOUR } from "../modules/radarSelection";
import { fetchLightningIfNeeded } from "../modules/lightning";
import {
  REFRESH_LATEST,
  CLEAR_CACHE,
  REGISTER_CHUNKS,
  RESET_CHUNK_STATUS,
  refreshLatest,
  fetchQued,
  clearCache,
  queRequestedHours,
} from "../modules/rainRadar";

export default function* rootSaga() {
  yield takeEvery(REGISTER_CHUNKS, fetchQued);
  yield takeEvery(CLEAR_CACHE, clearCache);
  yield takeEvery(SELECT_HOUR, queRequestedHours);
  yield takeEvery(SELECT_HOUR, fetchLightningIfNeeded);
  yield takeEvery(ASSERT_LOCATION, assertLocationPermission);
  yield takeEvery(REFRESH_LATEST, refreshLatest);
  yield takeEvery(REGISTER_CHUNKS, fetchQued);
  yield takeEvery(RESET_CHUNK_STATUS, fetchQued);
  yield takeEvery(LOCATION_GRANTED, getLocation);
  yield takeEvery(SET_LAT_LON, fetchPoint);
}
