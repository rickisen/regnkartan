import { generateDateCode } from "../../helpers";

let oldStringifiedDisplayChunks = "";

export const logger = store => next => action => {
  console.group(action.type);
  // console.info("dispatching", Object.keys(action));
  let result = next(action);

  // show comprehensive overview of chunks
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
  console.groupEnd();
  return result;
};
