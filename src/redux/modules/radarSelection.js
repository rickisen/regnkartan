// import { call, put, select, all } from "redux-saga/effects";
import { PropTypes } from "prop-types";

import { sort_unique } from "../../helpers/general";

/** ACTION TYPES **/
export const NAME = "regnkartan/smhi/radarSelection";
export const SELECT_FILE = `${NAME}/SELECT_FILE`;
export const SELECT_HOUR = `${NAME}/SELECT_HOUR`;

/** SAGAS **/

/** PropTypes **/
export const propTypes = {
  currentFile: PropTypes.string,
  requestedHours: PropTypes.arrayOf(PropTypes.number),
};

/** REDUCER **/
const initialState = {
  uri: "http://regn.rickisen.com/png/v1/latest.png",
  stamp: 0,
  dateCode: "",
  requestedHours: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SELECT_FILE:
      return {
        ...state,
        uri: action.uri || state.uri, // to keep showing the previous uri if no new is found
        stamp: action.stamp,
        dateCode: action.dateCode,
      };
    case SELECT_HOUR:
      return {
        ...state,
        requestedHours: sort_unique([
          ...state.requestedHours,
          action.hourStamp,
        ]),
      };
    default:
      return state;
  }
}
