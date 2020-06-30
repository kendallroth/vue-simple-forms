import { assert } from "chai";

// Utilities
import { FormLeaveGuardMixin } from "../src";

describe("Form Leave Guard Mixin", () => {
  it("should import mixin", () => {
    assert(
      Boolean(FormLeaveGuardMixin),
      "Did not import 'FormLeaveGuardMixin'"
    );
  });
});
