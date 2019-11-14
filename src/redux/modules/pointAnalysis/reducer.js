import * as T from "./types";

const initialState = {
  lat: 0,
  long: 0,
  data: null,
  forecastData: null,
  visible: false,
  isLoading: false,
  isLoadingForecast: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case T.POINT_ANALYSIS:
      return {
        ...state,
        isLoading: true,
        data: null,
      };
    case T.POINT_ANALYSIS_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case T.POINT_ANALYSIS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.data,
      };
    case T.FORECAST_POINT_ANALYSIS:
      return {
        ...state,
        isLoadingForecast: true,
        forecastData: null,
      };
    case T.FORECAST_POINT_ANALYSIS_FAIL:
      return {
        ...state,
        isLoadingForecast: false,
      };
    case T.FORECAST_POINT_ANALYSIS_SUCCESS:
      return {
        ...state,
        isLoadingForecast: false,
        forecastData: action.data,
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
