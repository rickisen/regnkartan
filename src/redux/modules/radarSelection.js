// import { call, put, select, all } from "redux-saga/effects";
import { PropTypes } from "prop-types";

import { generateDateCode, sort_unique } from "../../helpers/general";

/** ACTION TYPES **/
export const NAME = "regnkartan/smhi/radarSelection";
export const SELECT_FILE = `${NAME}/SELECT_FILE`;

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
        uri: action.uri || state.uri, // to keep showing the old one if non is find
        stamp: action.stamp,
        dateCode: action.dateCode,
        requestedHours: sort_unique([
          ...state.requestedHours,
          generateDateCode(action.stamp, true, false),
        ]),
      };
    default:
      return state;
  }
}
