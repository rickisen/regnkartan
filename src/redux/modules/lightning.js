import { PropTypes } from "prop-types";
import { call, put, select } from "redux-saga/effects";

import { beginningOfHour } from "../../helpers/time.js";
import { REQ } from "./watchedRequests.js";

const API = "https://opendata-download-lightning.smhi.se";

/** ACTION TYPES **/
export const NAME = "regnkartan/lightning";
export const GET_LIGHTNING = `${NAME}/GET_LIGHTNING`;
export const GET_LIGHTNING_SUCCESS = `${NAME}/GET_LIGHTNING_SUCCESS`;
export const GET_LIGHTNING_FAIL = `${NAME}/GET_LIGHTNING_FAIL`;

/** PropTypes **/
export const propTypes = {
  strikes: PropTypes.arrayOf(
    PropTypes.shape({
      version: PropTypes.number,
      year: PropTypes.number,
      month: PropTypes.number,
      day: PropTypes.number,
      hours: PropTypes.number,
      minutes: PropTypes.number,
      seconds: PropTypes.number,
      nanoseconds: PropTypes.number,
      lat: PropTypes.number,
      lon: PropTypes.number,
      peakCurrent: PropTypes.number,
      multiplicity: PropTypes.number,
      numberOfSensors: PropTypes.number,
      degreesOfFreedom: PropTypes.number,
      ellipseAngle: PropTypes.number,
      semiMajorAxis: PropTypes.number,
      semiMinorAxis: PropTypes.number,
      chiSquareValue: PropTypes.number,
      riseTime: PropTypes.number,
      peakToZeroTime: PropTypes.number,
      maxRateOfRise: PropTypes.number,
      cloudIndicator: PropTypes.number,
      angleIndicator: PropTypes.number,
      signalIndicator: PropTypes.number,
      timingIndicator: PropTypes.number,
    })
  ),
};

/** Selectors **/
export function selectStrikesAndStamp({
  lightning: { strikes },
  timeSelection: { stamp },
}) {
  return [strikes, stamp];
}

/** Sagas **/
/**
 * @param {{hourStamp: number}} timestamp on hour for which to evaluate
 */
export function* fetchLightningIfNeeded({ hourStamp }) {
  const day = new Date(beginningOfHour(new Date(hourStamp)));
  day.setUTCHours(0);

  const fetchedDays = yield select(
    ({ lightning: { fetchedDays } }) => fetchedDays
  );
  if (!fetchedDays.includes(day.getTime())) {
    yield call(fetchLightning, { stamp: hourStamp });
  }
}

/**
 * @param {{stamp: number}} timestamp on day for which to fetch
 */
export function* fetchLightning({ stamp }) {
  const day = new Date(beginningOfHour(new Date(stamp)));
  day.setUTCHours(0);

  const url = `${API}/api/version/latest/year/${day.getUTCFullYear()}/month/${day.getUTCMonth() +
    1}/day/${day.getUTCDate()}/data.json`;

  yield put({ type: GET_LIGHTNING });

  yield put({
    type: REQ,
    url,
    successSaga: function*(data) {
      let strikes = [];
      try {
        strikes = JSON.parse(data).values;
      } catch (e) {
        console.warn(
          "Something went wrong when parsing lightning data as json",
          e,
          day,
          data
        );
        yield put({ type: GET_LIGHTNING_FAIL, error: e });
        return;
      }
      yield put({ type: GET_LIGHTNING_SUCCESS, strikes, stamp: day.getTime() });
    },
    failSaga: function*(data, e) {
      console.warn(
        "Something went wrong when trying to fetch lightning strike data",
        url,
        day,
        data
      );
      yield put({ type: GET_LIGHTNING_FAIL, error: e });
      return;
    },
  });
}

/** REDUCER **/
const initialState = {
  loading: false,
  error: false,
  fetchedDays: [],
  strikes: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_LIGHTNING:
      return {
        ...state,
        loading: true,
      };
    case GET_LIGHTNING_SUCCESS:
      return {
        ...state,
        loading: false,
        fetchedDays: [...state.fetchedDays, action.stamp],
        strikes: [...state.strikes, ...action.strikes],
      };
    case GET_LIGHTNING_FAIL:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}
