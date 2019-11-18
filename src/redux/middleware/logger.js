/* eslint-disable no-unused-vars */
import { generateDateCode } from "../../helpers";
import { SELECT_FILE } from "../modules/timeSelection";
import { UNPACKING_FILE_SUCCESS } from "../modules/rainRadar";

let oldStringifiedDisplayChunks = "";
/**
 * @param {Object} store
 * @return {void}
 */
function logChunksOverview(store) {
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
  const stringifiedChunks = JSON.stringify(displayChunks);
  if (stringifiedChunks !== oldStringifiedDisplayChunks) {
    console.log("chunks", displayChunks);
  }
  oldStringifiedDisplayChunks = stringifiedChunks;
}

let oldStringifiedWatchedRequests = "";
/**
 * @param {Object} store
 * @return {void}
 */
function logWatchedRequestsOverview(store) {
  const { watchedRequests } = store.getState();
  const stringifiedWatchedRequests = JSON.stringify(watchedRequests);

  if (stringifiedWatchedRequests !== oldStringifiedWatchedRequests) {
    console.log("watchedRequests", watchedRequests);
  }

  oldStringifiedWatchedRequests = stringifiedWatchedRequests;
}

const ignoreActions = [SELECT_FILE, UNPACKING_FILE_SUCCESS];
/**
 * @param {Object} action
 * @param {Boolean} detailed
 * @return {void}
 */
function logAction(action, detailed = false) {
  if (!ignoreActions.includes(action.type)) {
    console.group(action.type);
  }
  if (detailed) {
    console.info("Keys: ", Object.keys(action));
  }
  if (!ignoreActions.includes(action.type)) {
    console.groupEnd();
  }
}

export const logger = store => next => action => {
  logAction(action, false);
  logChunksOverview(store);
  logWatchedRequestsOverview(store);
  return next(action);
};
