import {
  cacheDirectory,
  writeAsStringAsync,
  EncodingType,
} from "expo-file-system";
import JSZip from "jszip";

export function unzipToBase64Files(zipData) {
  return new Promise((resolve, reject) => {
    JSZip.loadAsync(zipData)
      .then(zip => {
        let promiseArr = [];

        // write unzipped files
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
                    // TODO: report which failed
                    // Sometimes we try to fetch a chunk that isn't created
                    // yet, so this gets run on a empty zip, which should not
                    // throw an 'error', just not extract anything.
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

        Promise.all(promiseArr).then(unzippedFiles => resolve(unzippedFiles));
      })
      .catch(e => {
        console.warn("Error occured when unzipping files to disk", e);
        reject(e);
      });
  });
}
