import { takeEvery } from "redux-saga/effects";
import {
  ASSERT_LOCATION,
  assertLocationPermission,
} from "../modules/permissions";
import { SELECT_HOUR } from "../modules/radarSelection";
import {
  REFRESH_LATEST,
  CLEAR_CACHE,
  REGISTER_CHUNKS,
  RESET_CHUNK_STATUS,
  refreshLatest,
  fetchQued,
  clearCache,
  queRequestedHours,
} from "../modules/wheatherData";

export default function* rootSaga() {
  yield takeEvery(REGISTER_CHUNKS, fetchQued);
  yield takeEvery(CLEAR_CACHE, clearCache);
  yield takeEvery(SELECT_HOUR, queRequestedHours);
  yield takeEvery(ASSERT_LOCATION, assertLocationPermission);
  yield takeEvery(REFRESH_LATEST, refreshLatest);
  yield takeEvery(REGISTER_CHUNKS, fetchQued);
  yield takeEvery(RESET_CHUNK_STATUS, fetchQued);
}
