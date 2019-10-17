import { PropTypes } from "prop-types";

export const propTypes = {
  error: PropTypes.bool,
  loadingPack: PropTypes.bool,
  unpacking: PropTypes.bool,
  chunks: PropTypes.shape({
    [PropTypes.string]: PropTypes.shape({
      status: PropTypes.oneOf([
        "loading",
        "loaded",
        "failed",
        "unpacking",
        "unpack-fail",
        "unpacked",
      ]),
      unpackedFiles: PropTypes.arrayOf(PropTypes.string),
      chunkSize: PropTypes.number,
    }),
  }),
};
