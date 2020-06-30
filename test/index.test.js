import { assert } from "chai";

describe("Dummy test", () => {
  it("should pass a dummy test", () => {
    const value = true;
    const expected = true;
    assert(value === expected, "True is not true!");
  });
});
