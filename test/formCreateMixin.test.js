import { assert } from "chai";

// Utilities
import { createForm, FormCreateMixin } from "../src";

describe("Form Create Function", () => {
  it("should import function", () => {
    assert(Boolean(createForm), "Did not import 'createForm' function");
  });
});

describe("Form Create Mixin", () => {
  it("should import mixin", () => {
    assert(Boolean(FormCreateMixin), "Did not import 'FormCreateMixin'");
  });
});
