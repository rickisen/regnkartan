import {
  apiUrl,
  packHoursIntoChunks,
  filterOutChunk,
  chunksFromFiles,
} from "../helpers";

/* eslint-disable no-undef */

describe(apiUrl, () => {
  it("should round to closest hour increment, and make valid s3 url", () => {
    expect(apiUrl(1573573421000, 1000 * 60 * 60 * 6)).toBe(
      "https://qwert.fra1.digitaloceanspaces.com/radar_19111212.pack"
    );
  });

  it("make a valid dynamic chunk api url", () => {
    expect(apiUrl(1573573421000, 1000 * 60 * 60 * 6, false)).toBe(
      "http://regn.rickisen.com/zip/v1/radar_19111215.pack?end=19111221"
    );
  });
});

const testChunks = {
  "1906211000": {
    status: "qued",
  },
  "1906211500": {
    status: "qued",
  },
};

// jest
//   .spyOn(global.Date, "constructor")
//   .mockImplementationOnce(() => new Date("2019-06-19T00:07:19.309Z"));

describe(packHoursIntoChunks, () => {
  it("pack an hour into a chunk", () => {});
  // it("pack an hour into a chunk", () => {
  //   expect(packHoursIntoChunks([testStamp], {})).toBe(10);
  // });
});

describe(filterOutChunk, () => {
  it("Should filter out supplied chunkKey", () => {
    expect(filterOutChunk(testChunks, "1906211500")).toStrictEqual({
      1906211000: { status: "qued" },
    });
  });
});

const files1 = [
  "file/path/radar_1906211000.png",
  "file/path/radar_1906211005.png",
  "file/path/radar_1906211010.png",
  "file/path/radar_1906211015.png",
  "file/path/radar_1906211020.png",
  "file/path/radar_1906211025.png",
  "file/path/radar_1906211030.png",
  "file/path/radar_1906211035.png",
  "file/path/radar_1906211040.png",
  "file/path/radar_1906211045.png",
  "file/path/radar_1906211050.png",
  "file/path/radar_1906211055.png",
];

const files2 = [
  "file/path/radar_1906212000.png",
  "file/path/radar_1906212005.png",
];

describe(chunksFromFiles, () => {
  it("Should create empty chunks object with no files", () => {
    expect(chunksFromFiles([])).toStrictEqual({});
  });

  it("Should create viable chunks object from complete hour", () => {
    expect(chunksFromFiles(files1)).toStrictEqual({
      1561111200000: {
        chunkSize: 1000 * 60 * 60,
        status: "unpacked",
        unpackedFiles: files1,
        complete: true,
      },
    });
  });

  it("Should create viable chunks object from incomplete hour", () => {
    expect(chunksFromFiles(files2)).toStrictEqual({
      1561147200000: {
        chunkSize: 1000 * 60 * 60,
        status: "unpacked",
        unpackedFiles: files2,
        complete: false,
      },
    });
  });

  it("Should create viable chunks object with mixed sizes", () => {
    expect(chunksFromFiles([...files1, ...files2])).toStrictEqual({
      1561111200000: {
        chunkSize: 1000 * 60 * 60,
        status: "unpacked",
        unpackedFiles: files1,
        complete: true,
      },
      1561147200000: {
        chunkSize: 1000 * 60 * 60,
        status: "unpacked",
        unpackedFiles: files2,
        complete: false,
      },
    });
  });
});
