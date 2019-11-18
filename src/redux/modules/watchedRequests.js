import { PropTypes } from "prop-types";
import { eventChannel, END } from "redux-saga";
import { call, put, take } from "redux-saga/effects";

/** ACTION TYPES **/
export const NAME = "regnkartan/smhi/watchedRequests";
export const REQ = `${NAME}/REQ`;
export const REQ_FAIL = `${NAME}/REQ_FAIL`;
export const REQ_PROGRESS = `${NAME}/REQ_PROGRESS`;
export const REQ_SUCCESS = `${NAME}/REQ_SUCCESS`;

/** SAGAS **/
export function* req({
  url,
  successSaga,
  failSaga,
  responseType = "text",
  method = "GET",
}) {
  const chan = yield call(reqChannel, url, responseType, method);
  let update = null;
  try {
    while (true) {
      update = yield take(chan);
      yield put(update);
    }
  } catch (e) {
    console.warn("Error occurred when requesting a url", e);
    yield put({ type: REQ_FAIL, url, readyState: 0, error: e });
    yield call(failSaga, update.data, e);
  } finally {
    if (update.type == REQ_SUCCESS) {
      yield call(successSaga, update.data);
    } else {
      yield call(failSaga, update.data);
    }
  }
}

function reqChannel(url, responseType = "text", method = "GET") {
  return eventChannel(emit => {
    var xhr = new XMLHttpRequest();

    xhr.onerror = error =>
      emit({
        type: REQ_FAIL,
        url,
        error,
        status: xhr.status,
        readyState: xhr.readyState,
      });

    xhr.ontimeout = () =>
      emit({
        type: REQ_FAIL,
        url,
        error: "TIMEOUT",
        readyState: xhr.readyState,
      });

    xhr.onloadstart = e =>
      emit({ type: REQ_PROGRESS, url, progress: e.loaded });

    xhr.onprogress = e => emit({ type: REQ_PROGRESS, url, progress: e.loaded });

    xhr.onloadend = e => emit({ type: REQ_PROGRESS, url, progress: e.loaded });

    xhr.onreadystatechange = () => {
      if (xhr.readyState < 4) {
        emit({
          type: REQ_PROGRESS,
          url,
          readyState: xhr.readyState,
          length: xhr.getResponseHeader("Content-Length"),
        });
      }

      if (
        xhr.readyState === XMLHttpRequest.DONE &&
        xhr.status > 199 &&
        xhr.status < 300
      ) {
        // console.log("xhr.response", url, xhr.headers, xhr.responseHeaders);
        emit({
          type: REQ_SUCCESS,
          url,
          status: xhr.status,
          data: xhr.response,
          readyState: xhr.readyState,
          cacheStatus: {
            cacheControl: xhr.getResponseHeader("Cache-Control"),
            lastModified: xhr.getResponseHeader("Last-Modified"),
            lastRequested: Date.now(),
          },
        });
        emit(END);
      } else if (xhr.readyState === XMLHttpRequest.DONE) {
        emit({
          type: REQ_FAIL,
          url,
          error: xhr.status,
          data: xhr.response,
          readyState: xhr.readyState,
        });
        emit(END);
      }
    };

    xhr.open(method, url);
    xhr.responseType = responseType;
    xhr.send();

    return () => {
      xhr.abort();
    };
  });
}

/** PropTypes **/
export const propTypes = PropTypes.shape({
  [PropTypes.string]: PropTypes.shape({
    progress: PropTypes.string,
    readyState: PropTypes.number,
    length: PropTypes.string,
    status: PropTypes.number,
    error: PropTypes.any,
    loading: PropTypes.bool,
  }),
});

/** Selectors **/
export function selectReqProgress({ watchedRequests }, url) {
  const { progress, readyState, length } = watchedRequests[url];
  const advProg = Math.max(
    10,
    Math.min(100, (parseInt(progress) / parseInt(length)) * 90)
  );
  switch (readyState) {
    case 0:
      return 0;
    case 1:
      return 5;
    case 2:
      return 10;
    case 3:
      return isNaN(advProg) ? 50 : advProg;
    case 4:
      return 101;
    default:
      return 0;
  }
}

export function selectReqsMeanProgress({ watchedRequests }) {
  const progresses = Object.keys(watchedRequests)
    .map(url => selectReqProgress({ watchedRequests }, url))
    .filter(p => p < 101);

  const cumulativeProgress = progresses.reduce((acc, next) => acc + next, 0);
  return cumulativeProgress / progresses.length;
}

/** REDUCER **/
const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQ:
      return {
        ...state,
        [action.url]: {
          loading: true,
          progress: "",
          readyState: 0,
          status: null,
          cacheStatus: null,
          error: null,
        },
      };
    case REQ_PROGRESS:
      return {
        ...state,
        [action.url]: {
          ...state[action.url],
          loading: true,
          progress: action.progress || state[action.url].progress || null,
          readyState: action.readyState || state[action.url].readyState || null,
          length: action.length || state[action.url].length || null,
        },
      };
    case REQ_SUCCESS:
      return {
        ...state,
        [action.url]: {
          ...state[action.url],
          loading: false,
          readyState: action.readyState,
          status: action.status,
          cacheStatus: action.cacheStatus,
        },
      };
    case REQ_FAIL:
      return {
        ...state,
        [action.url]: {
          ...state[action.url],
          readyState: action.readyState,
          loading: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}
