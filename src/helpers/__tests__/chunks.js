import { packHoursIntoChunks, filterOutChunk } from "../chunks";

const testStamp = 1561114500000;
const testCode = "1906211055";

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
