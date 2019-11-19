import {
  apiUrl,
  filterOutChunk,
  makeChunks,
  generateChunksForDay,
  chunkForTime,
} from "../helpers";

import { beginningOfDay } from "../../../../helpers";
/* eslint-disable no-undef */

const testChunks = {
  "1906211000": {
    status: "qued",
  },
  "1906211500": {
    status: "qued",
  },
};

const chunksForADay = {
  "1546300800000": {
    chunkSize: 21600000,
    status: "on-hold",
    unpackedFiles: [],
  },
  "1546322400000": {
    chunkSize: 21600000,
    status: "on-hold",
    unpackedFiles: [],
  },
  "1546344000000": {
    chunkSize: 21600000,
    status: "on-hold",
    unpackedFiles: [],
  },
  "1546365600000": {
    chunkSize: 21600000,
    status: "on-hold",
    unpackedFiles: [],
  },
};

const fullChunksForFirstJan = {
  "1546214400000": {
    chunkSize: 21600000,
    status: "on-hold",
    unpackedFiles: [],
  },
  "1546236000000": {
    chunkSize: 21600000,
    status: "on-hold",
    unpackedFiles: [],
  },
  "1546257600000": {
    chunkSize: 21600000,
    status: "on-hold",
    unpackedFiles: [],
  },
  "1546279200000": {
    chunkSize: 21600000,
    status: "on-hold",
    unpackedFiles: [],
  },
  "1546300800000": {
    chunkSize: 21600000,
    status: "on-hold",
    unpackedFiles: [],
  },
  "1546322400000": {
    chunkSize: 21600000,
    status: "on-hold",
    unpackedFiles: [],
  },
  "1546344000000": {
    chunkSize: 21600000,
    status: "on-hold",
    unpackedFiles: [],
  },
  "1546351200000": {
    chunkSize: 3600000,
    status: "qued",
    unpackedFiles: [],
  },
  "1546365600000": {
    chunkSize: 21600000,
    status: "on-hold",
    unpackedFiles: [],
  },
  "1546387200000": {
    chunkSize: 86400000,
    status: "on-hold",
    unpackedFiles: [],
  },
  "1546473600000": {
    chunkSize: 86400000,
    status: "on-hold",
    unpackedFiles: [],
  },
};

describe(apiUrl, () => {
  it("should round to closest hour increment, and make valid s3 url", () => {
    expect(apiUrl(1573573421000)).toBe(
      "https://qwert.fra1.digitaloceanspaces.com/radar_19111212.pack"
    );
  });
});

describe(filterOutChunk, () => {
  it("Should filter out supplied chunkKey", () => {
    expect(filterOutChunk(testChunks, "1906211500")).toStrictEqual({
      1906211000: { status: "qued" },
    });
  });
});

describe(generateChunksForDay, () => {
  it("can generate correct chunks for 2019-01-01", () => {
    expect(generateChunksForDay(beginningOfDay(1546300800000))).toStrictEqual(
      chunksForADay
    );
  });
});

describe(chunkForTime, () => {
  it("can find the correct chunk, when time is === to key", () => {
    expect(chunkForTime(1546365600000, fullChunksForFirstJan)).toStrictEqual(
      "1546365600000"
    );
  });

  it("can find the correct chunk, when time is somewhere in chunk", () => {
    expect(chunkForTime(1546365900000, fullChunksForFirstJan)).toStrictEqual(
      "1546365600000"
    );
  });
});

describe(makeChunks, () => {
  it("can generate correct default static chunks for 2019-01-01", () => {
    expect(makeChunks(1546351200000)).toStrictEqual(fullChunksForFirstJan);
  });

  const chunksWithPreviousData = {
    "1546214400000": {
      chunkSize: 21600000,
      status: "loaded",
      unpackedFiles: [],
    },
  };

  const chunksWithPreviousDataIntact = {
    ...fullChunksForFirstJan,
  };
  chunksWithPreviousDataIntact["1546214400000"] =
    chunksWithPreviousData["1546214400000"];

  it("can generate correct default static chunks for 2019-01-01, with previous data present", () => {
    expect(makeChunks(1546351200000, chunksWithPreviousData)).toStrictEqual(
      chunksWithPreviousDataIntact
    );
  });

  it("can generate correct default static chunks with qued hours", () => {
    const last = 1546473600000;
    const chunksWithLastQued = {
      ...fullChunksForFirstJan,
      ["" + last]: {
        ...fullChunksForFirstJan["" + last],
        status: "qued",
      },
    };
    expect(makeChunks(1546351200000, {}, [last])).toStrictEqual(
      chunksWithLastQued
    );
  });

  it("can add cached/downloaded files into the correct chunk", () => {
    const chunksWithFile = {
      ...fullChunksForFirstJan,
      ["1546344000000"]: {
        ...fullChunksForFirstJan["1546344000000"],
        status: "unpacked",
        unpackedFiles: [
          "/path/to/cache/radar_1901011335.png",
          "/path/to/cache/radar_1901011340.png",
        ],
      },
    };
    expect(
      makeChunks(
        1546351200000,
        {},
        [],
        [
          "/path/to/cache/radar_1901011335.png",
          "/path/to/cache/radar_1901011340.png",
        ]
      )
    ).toStrictEqual(chunksWithFile);
  });
});
