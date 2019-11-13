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
  "file/path/radar_1906210600.png",
  "file/path/radar_1906210605.png",
  "file/path/radar_1906210610.png",
  "file/path/radar_1906210615.png",
  "file/path/radar_1906210620.png",
  "file/path/radar_1906210625.png",
  "file/path/radar_1906210630.png",
  "file/path/radar_1906210635.png",
  "file/path/radar_1906210640.png",
  "file/path/radar_1906210645.png",
  "file/path/radar_1906210650.png",
  "file/path/radar_1906210655.png",

  "file/path/radar_1906210700.png",
  "file/path/radar_1906210705.png",
  "file/path/radar_1906210710.png",
  "file/path/radar_1906210715.png",
  "file/path/radar_1906210720.png",
  "file/path/radar_1906210725.png",
  "file/path/radar_1906210730.png",
  "file/path/radar_1906210735.png",
  "file/path/radar_1906210740.png",
  "file/path/radar_1906210745.png",
  "file/path/radar_1906210750.png",
  "file/path/radar_1906210755.png",

  "file/path/radar_1906210800.png",
  "file/path/radar_1906210805.png",
  "file/path/radar_1906210810.png",
  "file/path/radar_1906210815.png",
  "file/path/radar_1906210820.png",
  "file/path/radar_1906210825.png",
  "file/path/radar_1906210830.png",
  "file/path/radar_1906210835.png",
  "file/path/radar_1906210840.png",
  "file/path/radar_1906210845.png",
  "file/path/radar_1906210850.png",
  "file/path/radar_1906210855.png",

  "file/path/radar_1906210900.png",
  "file/path/radar_1906210905.png",
  "file/path/radar_1906210910.png",
  "file/path/radar_1906210915.png",
  "file/path/radar_1906210920.png",
  "file/path/radar_1906210925.png",
  "file/path/radar_1906210930.png",
  "file/path/radar_1906210935.png",
  "file/path/radar_1906210940.png",
  "file/path/radar_1906210945.png",
  "file/path/radar_1906210950.png",
  "file/path/radar_1906210955.png",

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

  "file/path/radar_1906211100.png",
  "file/path/radar_1906211105.png",
  "file/path/radar_1906211110.png",
  "file/path/radar_1906211115.png",
  "file/path/radar_1906211120.png",
  "file/path/radar_1906211125.png",
  "file/path/radar_1906211130.png",
  "file/path/radar_1906211135.png",
  "file/path/radar_1906211140.png",
  "file/path/radar_1906211145.png",
  "file/path/radar_1906211150.png",
  "file/path/radar_1906211155.png",
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
      1561096800000: {
        chunkSize: 1000 * 60 * 60 * 6,
        status: "unpacked",
        unpackedFiles: files1,
        complete: true,
      },
    });
  });

  it("Should create viable chunks object from incomplete hour", () => {
    expect(chunksFromFiles(files2)).toStrictEqual({
      1561140000000: {
        chunkSize: 1000 * 60 * 60 * 6,
        status: "unpacked",
        unpackedFiles: files2,
        complete: false,
      },
    });
  });

  it("Should create viable chunks object with mixed sizes", () => {
    expect(chunksFromFiles([...files1, ...files2])).toStrictEqual({
      1561096800000: {
        chunkSize: 1000 * 60 * 60 * 6,
        status: "unpacked",
        unpackedFiles: files1,
        complete: true,
      },
      1561140000000: {
        chunkSize: 1000 * 60 * 60 * 6,
        status: "unpacked",
        unpackedFiles: files2,
        complete: false,
      },
    });
  });
});
