import {
  timeFromDateCode,
  generateDateCode,
  generateDateCodeRange,
  timeFromFilePath,
} from "../dateCode";

const testStamp = 1561114500000;
const testCode = "1906211055";

describe(timeFromDateCode, function() {
  it("should work with full dateCode", function() {
    expect(timeFromDateCode(testCode).getTime()).toEqual(testStamp);
  });
  it("should work with partial dateCode", function() {
    expect(timeFromDateCode("190621").getTime()).toEqual(1561075200000);
  });
  it("should throw with bad dateCode", function() {
    expect(() => timeFromDateCode("notADateCode")).toThrow(
      "dateCode not valid"
    );
  });
});

describe(generateDateCode, function() {
  it("should create a partial dateCode from a timestamp", function() {
    expect(generateDateCode(testStamp)).toEqual("190621");
  });

  it("should create a dateCode with hours from a timestamp", function() {
    expect(generateDateCode(testStamp, true)).toEqual("19062110");
  });

  it("should create a full dateCode from a timestamp", function() {
    expect(generateDateCode(testStamp, true, true)).toEqual(testCode);
  });
});

describe(generateDateCodeRange, function() {
  it("should create a valid dateCodeRange", function() {
    expect(
      generateDateCodeRange(testStamp, testStamp + 1000 * 60 * 5 * 3)
    ).toEqual([testCode, "1906211100", "1906211105"]);
  });
});

describe(timeFromFilePath, function() {
  it("finds a valid time", function() {
    expect(
      timeFromFilePath("/path/to/imaginary/file/radar_1906211055.png")
    ).toEqual(testStamp);
  });
  it("finds a valid time in a pmean file", function() {
    expect(
      timeFromFilePath("/path/to/imaginary/file/pmean_19062110.png")
    ).toEqual(1561111200000);
  });
});
