import { filterOutChunk } from "../../../helpers";
import * as T from "./types";

const initialState = {
  error: null,
  loadingPack: false,
  unpacking: false,
  chunks: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case T.REGISTER_CHUNKS:
      return {
        ...state,
        chunks: { ...state.chunks, ...action.chunks },
      };
    case T.FETCH_CHUNK:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{ status: "loading" },
          },
        },
      };
    case T.CLEAR_CHUNK:
      return {
        ...state,
        chunks: {
          ...filterOutChunk(state.chunks, action.time),
        },
      };
    case T.FETCH_CHUNK_SUCCESS:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{ status: "loaded" },
          },
        },
      };
    case T.FETCH_CHUNK_FAIL:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{ status: "failed" },
          },
        },
      };
    case T.UNPACKING_CHUNK:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{ status: "unpacking" },
          },
        },
      };
    case T.UNPACKING_CHUNK_FAIL:
      return {
        ...state,
        chunks: {
          ...Object.keys(state.chunks)
            .filter(k => parseInt(k) !== action.time)
            .reduce((acc, k) => {
              acc[k] = state.chunks[k];
              return acc;
            }, {}),
        },
      };
    case T.UNPACKING_FILE_SUCCESS:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{
              unpackedFiles: [
                ...state.chunks[action.time].unpackedFiles,
                action.uri,
              ],
            },
          },
        },
      };
    case T.UNPACKING_CHUNK_SUCCESS:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            status: "unpacked",
            complete: !action.unfinished,
          },
        },
      };
    case T.RESET_CHUNK_STATUS:
      return {
        ...state,
        chunks: {
          ...state.chunks,
          [action.time]: {
            ...state.chunks[action.time],
            ...{ status: "qued" },
          },
        },
      };
    default:
      return state;
  }
}
