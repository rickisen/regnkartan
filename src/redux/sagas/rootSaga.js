import { takeEvery } from "redux-saga/effects";
import {
  ASSERT_LOCATION,
  assertLocationPermission,
} from "../modules/permissions";
import { SELECT_HOUR } from "../modules/radarSelection";
import {
  CLEAR_CACHE,
  REGISTER_CHUNKS,
  fetchQued,
  clearCache,
  queRequestedHours,
} from "../modules/wheatherData";

export default function* rootSaga() {
  yield takeEvery(REGISTER_CHUNKS, fetchQued);
  yield takeEvery(CLEAR_CACHE, clearCache);
  yield takeEvery(SELECT_HOUR, queRequestedHours);
  yield takeEvery(ASSERT_LOCATION, assertLocationPermission);
}
