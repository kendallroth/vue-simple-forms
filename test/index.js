import { assert } from "chai";

describe("Passing test", () => {
  it("should pass a dummy test", () => {
    const value = true;
    const expected = true;
    assert(value === expected, "True is not true!");
  });
});
