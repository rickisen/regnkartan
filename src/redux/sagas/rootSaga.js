import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { FETCH_DAY, fetchDay } from "../modules/radarImages";

export default function* rootSaga() {
  yield takeEvery(FETCH_DAY, fetchDay);
}
