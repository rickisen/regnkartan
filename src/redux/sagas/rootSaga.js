import { takeEvery } from "redux-saga/effects";
import {
  FETCH_CHUNK,
  FETCH_RECENT,
  FETCH_FULL,
  fetchFullDay,
  fetchRecent,
  fetchChunk,
} from "../modules/zip";

export default function* rootSaga() {
  yield takeEvery(FETCH_FULL, fetchFullDay);
  yield takeEvery(FETCH_RECENT, fetchRecent);
  yield takeEvery(FETCH_CHUNK, fetchChunk);
}
