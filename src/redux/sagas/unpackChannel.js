import { eventChannel, END } from "redux-saga";
import {
  cacheDirectory,
  writeAsStringAsync,
  EncodingType,
} from "expo-file-system";

export default function unpackChannel(packedData) {
  return eventChannel(emit => {
    const lastFileName = packedData.files[packedData.files.length - 1].name;
    for (const file of packedData.files) {
      const { base64, name } = file;
      const uri = `${cacheDirectory}${name}`;
      writeAsStringAsync(uri, base64, {
        encoding: EncodingType.Base64,
      })
        .then(() => {
          emit({ uri });
          if (file.name === lastFileName) {
            emit(END);
          }
        })
        .catch(e => {
          console.warn("Error occurred when writing unpackped file to disk", e);
        });
    }

    return () => {}; //TODO: we are done delete pack-file maybe?
  });
}
