import { takeEvery } from "redux-saga/effects";
import { FETCH_DAY, fetchDay } from "../modules/radarImages";
import { FETCH as FETCH_ZIP, fetchZip } from "../modules/zip";

export default function* rootSaga() {
  yield takeEvery(FETCH_DAY, fetchDay);
  yield takeEvery(FETCH_ZIP, fetchZip);
}
