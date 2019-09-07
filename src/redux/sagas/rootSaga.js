import { takeEvery } from "redux-saga/effects";
import { SELECT_HOUR } from "../modules/radarSelection";
import {
  FETCH_CHUNK,
  CLEAR_CACHE,
  REGISTER_CHUNKS,
  fetchQued,
  fetchChunk,
  clearCache,
  queRequestedHours,
} from "../modules/zip";

export default function* rootSaga() {
  yield takeEvery(FETCH_CHUNK, fetchChunk);
  yield takeEvery(REGISTER_CHUNKS, fetchQued);
  yield takeEvery(CLEAR_CACHE, clearCache);
  yield takeEvery(SELECT_HOUR, queRequestedHours);
}
