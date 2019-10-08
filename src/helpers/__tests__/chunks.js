import { packHoursIntoChunks } from "../chunks";

const testStamp = 1561114500000;
const testCode = "1906211055";

// jest
//   .spyOn(global.Date, "constructor")
//   .mockImplementationOnce(() => new Date("2019-06-19T00:07:19.309Z"));

describe(packHoursIntoChunks, () => {
  it("pack an hour into a chunk", () => {});
  // it("pack an hour into a chunk", () => {
  //   expect(packHoursIntoChunks([testStamp], {})).toBe(10);
  // });
});
