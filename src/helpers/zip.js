import { FileSystem } from "expo";
import JSZip from "jszip";

export function unzipToBase64Files(zipData) {
  return new Promise((resolve, reject) => {
    JSZip.loadAsync(zipData).then(zip => {
      let promiseArr = []

      // write unzipped files
      zip.forEach((relativePath, file) => {
        if (file.dir) return;

        const uri = `${FileSystem.cacheDirectory}${relativePath}`;

        promiseArr.push(new Promise((resolve, reject) => {
          file.async("base64").then(base64 => {
            FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingTypes.Base64,
            }).then(() => {
              resolve(uri)
            }).catch((e) =>{
              // TODO: report which failed
              console.warn("Error occurred when writting unzipped file to disk", uri, e);
            });
          });
        }))
      });

      Promise.all(promiseArr).then((unzippedFiles) => resolve(unzippedFiles))
    }).catch((e) => {
      console.warn('Error occured when unzipping files to disk', e) ; reject(e)
    });
  })
}
