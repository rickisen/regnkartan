/* eslint-disable no-unused-vars */
import { generateDateCode } from "../../helpers";
import { SELECT_FILE } from "../modules/timeSelection";
import { UNPACKING_FILE_SUCCESS } from "../modules/rainRadar";
import { REQ_PROGRESS } from "../modules/watchedRequests";
import { diff } from "deep-object-diff";

let oldDisplayChunks = "";
/**
 * @param {Object} store
 * @param {Boolean} displayDiff
 * @return {void}
 */
function logChunksOverview(store, displayDiff = true) {
  const {
    rainRadar: { chunks },
  } = store.getState();
  const displayChunks = Object.keys(chunks).reduce(
    (acc, next) => ({
      ...acc,
      [generateDateCode(parseInt(next), true)]: {
        ...chunks[next],
        chunkSize: chunks[next].chunkSize / (1000 * 60 * 60),
        unpackedFiles:
          chunks[next].unpackedFiles.length > 3
            ? chunks[next].unpackedFiles.length
            : chunks[next].unpackedFiles.map(e =>
                e.substring(e.length - 20, e.length)
              ),
      },
    }),
    {}
  );
  const diffed = diff(displayChunks, oldDisplayChunks);
  if (Object.keys(diffed).length !== 0) {
    console.log("chunks", displayDiff ? diffed : displayChunks);
  }
  oldDisplayChunks = displayChunks;
}

let oldDisplayReqs = "";
/**
 * @param {Object} store
 * @param {Boolean} displayDiff
 * @return {void}
 */
function logWatchedRequestsOverview(store, displayDiff = true) {
  const { watchedRequests } = store.getState();

  const displayReqs = Object.keys(watchedRequests).reduce(
    (acc, next) => ({
      ...acc,
      ...{
        [next]: {
          ...watchedRequests[next],
          progress: "ignored",
        },
      },
    }),
    {}
  );

  const diffed = diff(oldDisplayReqs, displayReqs);
  if (Object.keys(diffed).length !== 0) {
    console.log("watchedRequests: ", displayDiff ? diffed : displayReqs);
  }

  oldDisplayReqs = displayReqs;
}

const ignoreActions = [SELECT_FILE, UNPACKING_FILE_SUCCESS, REQ_PROGRESS];
/**
 * @param {Object} action
 * @param {Boolean} detailed
 * @return {void}
 */
function logAction(action, detailed = false) {
  if (!ignoreActions.includes(action.type)) {
    console.group(action.type);
    if (detailed) {
      console.info("Keys: ", Object.keys(action));
    }
  }
}

export const logger = store => next => action => {
  const ret = next(action);

  if (!ignoreActions.includes(action.type)) {
    setTimeout(() => {
      logAction(action);
      logChunksOverview(store);
      logWatchedRequestsOverview(store);
      console.groupEnd();
      console.log("====================");
    }, 0);
  }

  return ret;
};
