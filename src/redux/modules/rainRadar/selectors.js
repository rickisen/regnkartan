export function allChunks({ rainRadar: { chunks } }) {
  return chunks;
}

export function allChunksDone({ rainRadar: { chunks } }) {
  for (var stamp in chunks) {
    if (
      chunks[stamp].status !== "unpacked" &&
      chunks[stamp].status !== "unpack-fail" &&
      chunks[stamp].status !== "failed"
    ) {
      return false;
    }
  }
  return true;
}
