import { PropTypes } from "prop-types";
import { call, put } from "redux-saga/effects";
import * as Permissions from "expo-permissions";

/** ACTION TYPES **/
export const NAME = "regnkartan/permissions";
export const ASSERT_LOCATION = `${NAME}/ASSERT_LOCATION`;
export const LOCATION_GRANTED = `${NAME}/LOCATION_GRANTED`;
export const LOCATION_DENIED = `${NAME}/LOCATION_DENIED`;

export function* assertLocationPermission() {
  let response = null;
  try {
    response = yield call(Permissions.askAsync, Permissions.LOCATION);
  } catch (e) {
    console.warn("Error occured when looking for location permissions", e);
    yield put({ type: LOCATION_DENIED });
    return;
  }

  if (response && response.status === "granted") {
    yield put({ type: LOCATION_GRANTED });
    return;
  } else {
    yield put({ type: LOCATION_DENIED });
    return;
  }
}

/** PropTypes **/
export const propTypes = {
  granted: PropTypes.arrayOf(PropTypes.oneOf(["LOCATION"])),
  denied: PropTypes.arrayOf(PropTypes.oneOf(["LOCATION"])),
};

/** REDUCER **/
const initialState = {
  granted: [],
  denied: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOCATION_DENIED:
      return {
        ...state,
        denied: [...state.denied, "LOCATION"],
      };
    case LOCATION_GRANTED:
      return {
        ...state,
        granted: [...state.granted, "LOCATION"],
      };
    default:
      return state;
  }
}
