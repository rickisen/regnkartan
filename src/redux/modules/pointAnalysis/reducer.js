import * as T from "./types";

const initialState = {
  lat: 0,
  long: 0,
  data: null,
  visible: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case T.POINT_ANALYSIS:
      return {
        ...state,
        isLoading: true,
      };
    case T.POINT_ANALYSIS_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case T.POINT_ANALYSIS_SUCCES:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case T.SET_LAT_LON:
      return {
        ...state,
        lat: action.lat,
        lon: action.lon,
      };
    case T.EXTENDED_DATA_VISIBLE:
      return {
        ...state,
        visible: action.visible,
      };
    default:
      return state;
  }
}
