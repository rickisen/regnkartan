/** ACTION TYPES **/
const NAME = 'regnkartan/smhi/images'
const FETCH_DAY = `${NAME}/FETCH_DAY`
const FETCH_DAY_SUCCESS = `${NAME}/FETCH_DAY_SUCCESS`
const FETCH_DAY_FAIL = `${NAME}/FETCH_DAY_FAIL`

const API_URL = 'https://opendata-download-radar.smhi.se/api/version/latest/area/sweden/product/comp/'

/** ACTION CREATORS **/
export const fetchDay = (day) => {
  return (dispatch, getState) => {
    dispatch({type: FETCH_DAY})
    fetch(API_URL + day + '/?format=png', {
      method: 'GET',
    })
    .then((r) => r.json())
    .then((r) => {
      return dispatch({
        type: FETCH_DAY_SUCCESS,
        files: r.files,
      })
    })
    .catch((e) => {
      console.log(e);
      return dispatch({ type: FETCH_DAY_FAIL })
    })
  }
}

/** REDUCER **/
export default function reducer(state = {
  error: null,
  loadingDay: false,
  files: [],
}, action) {
  switch (action.type) {
    case FETCH_DAY:
      return {
        ...state,
        error: null,
        loadingDay: true,
      }
    case FETCH_DAY_SUCCESS:
      return {
        ...state,
        error: null,
        loadingDay: false,
        files: [
          ...state.files,
          ...action.files,
        ],
      }
    case FETCH_DAY_FAIL:
      return {
        ...state,
        error: action.error,
        loadingDay: false,
      }
    default:
      return state
  }
}
