import { eventChannel, END } from "redux-saga";
import {
  cacheDirectory,
  writeAsStringAsync,
  EncodingType,
} from "expo-file-system";
import JSZip from "jszip";

export default function unzipChannel(zipData) {
  return eventChannel(emit => {
    JSZip.loadAsync(zipData)
      .then(zip => {
        let processed = 0;
        const ammountOfFiles = Object.keys(zip.files).filter(n =>
          n.includes(".png")
        ).length;
        zip.forEach((relativePath, file) => {
          if (file.dir) return;
          const uri = `${cacheDirectory}${relativePath}`;
          file
            .async("base64")
            .then(base64 => {
              writeAsStringAsync(uri, base64, {
                encoding: EncodingType.Base64,
              })
                .then(() => {
                  emit({ uri });
                  processed++;
                  if (processed >= ammountOfFiles) {
                    emit(END);
                  }
                })
                .catch(e => {
                  console.warn(
                    "Error occurred when writing unzipped file to disk",
                    e
                  );
                });
            })
            .catch(e => {
              console.warn(
                "Error occurred when streaming unzipped file as base64",
                e
              );
            });
        });
      })
      .catch(e => {
        console.warn("Error occurred when loading zip-file", e);
      });

    return () => {}; //TODO: we are done delete zip-file maybe?
  });
}
