import { eventChannel, END } from "redux-saga";
import { call, put, take } from "redux-saga/effects";
import {
  cacheDirectory,
  writeAsStringAsync,
  EncodingType,
} from "expo-file-system";

/** unpack - saga that unpacks a packed chunk (a pack) onto the file system
 * @param {string} pack from response
 * @param {number} time identifier for this chunk
 * @param {[FETCH_CHUNK_FAIL, FETCH_CHUNK_SUCCESS, UNPACKING_CHUNK, UNPACKING_CHUNK_FAIL, UNPACKING_CHUNK_SUCCESS, UNPACKING_FILE_FAIL, UNPACKING_FILE_SUCCESS]}
 * @return {void}
 */
export default function* unpack(
  pack,
  time,
  [
    FETCH_CHUNK_FAIL,
    FETCH_CHUNK_SUCCESS,
    UNPACKING_CHUNK,
    UNPACKING_CHUNK_FAIL,
    UNPACKING_CHUNK_SUCCESS,
    UNPACKING_FILE_FAIL,
    UNPACKING_FILE_SUCCESS,
  ]
) {
  // const callTime = new Date().getTime();
  let data = null;
  try {
    data = JSON.parse(pack);
  } catch (e) {
    console.warn("Error occured when unpacking data", e);
    yield put({ type: FETCH_CHUNK_FAIL, error: e, time });
    return;
  }
  yield put({ type: FETCH_CHUNK_SUCCESS, time });

  yield put({ type: UNPACKING_CHUNK, time });
  try {
    yield call(unpackWatcher, data, time, [
      UNPACKING_FILE_SUCCESS,
      UNPACKING_FILE_FAIL,
      UNPACKING_CHUNK_SUCCESS,
    ]);
  } catch (e) {
    console.warn("Error occured when unpacking chunk files", e, time);
    yield put({ type: UNPACKING_CHUNK_FAIL, error: e, time });
    return;
  }

  return;
}

export function unpackChannel(packedData) {
  return eventChannel(emit => {
    const lastFileName = packedData.files[packedData.files.length - 1].name;
    for (const file of packedData.files) {
      const { base64, name } = file;
      const uri = `${cacheDirectory}${name}`;
      writeAsStringAsync(uri, base64, {
        encoding: EncodingType.Base64,
      })
        .then(() => {
          emit({ uri });
          if (file.name === lastFileName) {
            emit(END);
          }
        })
        .catch(e => {
          console.warn("Error occurred when writing unpackped file to disk", e);
        });
    }

    return () => {};
  });
}

export function* unpackWatcher(
  data,
  time,
  [UNPACKING_FILE_SUCCESS, UNPACKING_FILE_FAIL, UNPACKING_CHUNK_SUCCESS]
) {
  const chan = yield call(unpackChannel, data);
  try {
    // while (true) loops work in a non blocking way inside generators don't
    // panic!
    while (true) {
      // take(END) will cause the saga to terminate by jumping to the finally block
      const { uri } = yield take(chan);
      yield put({ type: UNPACKING_FILE_SUCCESS, uri, time });
    }
  } catch (e) {
    console.warn("Error occurred when unpacking a file", e);
    yield put({ type: UNPACKING_FILE_FAIL, time });
  } finally {
    yield put({
      type: UNPACKING_CHUNK_SUCCESS,
      time,
      unfinished: data.unfinished,
    });
  }
}
