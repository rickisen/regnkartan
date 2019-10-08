import { incrementsOfFive, pad, sort_unique } from "../general";

describe(incrementsOfFive, () => {
  it("should round to closest increment", () => {
    expect(incrementsOfFive(11)).toBe(10);
  });

  it("should retrun 0 when close to it", () => {
    expect(incrementsOfFive(1)).toBe(0);
  });
});

describe(pad, () => {
  it("pads with 1 zero", () => {
    expect(pad(1)).toBe("01");
  });

  it("can pad with multiple zeroes", () => {
    expect(pad(1, 3)).toBe("001");
  });

  it("can pad with spaces", () => {
    expect(pad("a", undefined, " ")).toBe(" a");
  });
});

describe(sort_unique, () => {
  it("should sort", () => {
    expect(sort_unique([20, 0, 10])).toStrictEqual([0, 10, 20]);
  });

  it("should filter out duplicated values", () => {
    expect(sort_unique(["a", "a", "b", "c"])).toStrictEqual(["a", "b", "c"]);
  });
});
