import { call } from "redux-saga/effects";
import {
  cacheDirectory,
  writeAsStringAsync,
  EncodingType,
} from "expo-file-system";
import JSZip from "jszip";

/**
 * @generator unzipSaga - clears all zip and png files in our cache directory
 * @param {ArrayBuffer} zipData - zip file as array buffer
 * @return {[string]} unzippedFiles - array of uri's of the unzipped files
 * */
export default function* unzipSaga(zipData) {
  let zip = "";
  const promiseArr = [];
  const unzippedFiles = [];
  try {
    zip = yield call(JSZip.loadAsync, zipData);
  } catch (e) {
    console.warn("Error occurred when loading zip file", e);
  }

  zip.forEach((relativePath, file) => {
    if (file.dir) return;
    const uri = `${cacheDirectory}${relativePath}`;

    promiseArr.push(
      new Promise(resolve => {
        file.async("base64").then(base64 => {
          writeAsStringAsync(uri, base64, {
            encoding: EncodingType.Base64,
          })
            .then(() => {
              resolve(uri);
            })
            .catch(e => {
              console.warn(
                "Error occurred when writting unzipped file to disk",
                uri,
                e
              );
            });
        });
      })
    );
  });

  // TODO: examine saga channels
  for (const promise of promiseArr) {
    const uri = yield call(() => promise);
    unzippedFiles.push(uri);
  }

  return unzippedFiles;
}
