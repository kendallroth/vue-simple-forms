import Vue from "vue";
import { shallowMount, Wrapper } from "@vue/test-utils";

// Utilities
import { createForm, FormGuardMixin } from "../src";

const nextFn = jest.fn();
const Component = Vue.component("formComponent", {
  template: "<div />",
});

/**
 * Shallow mount a component with the mixin (and custom options)
 * @param  {string} formKey - Form key
 * @return                  - Vue wrapper
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mountComponent = (
  formKey: string
): Wrapper<Vue> & { [key: string]: any } =>
  shallowMount(Component, {
    data() {
      return {
        // NOTE: Must spread setup values to avoid mutating by reference!
        [formKey]: createForm({ ...fields }),
        // @ts-ignore
        formGuards: [this[formKey]],
      };
    },
    mixins: [FormGuardMixin],
  });

const formName = "form";
const fields = {
  email: "test@example.com",
  password: "******",
};
const fieldChanges = {
  email: "noone@example.com",
};

const activeKey = "isFormGuardActive";
const callbackKey = "formLeaveCallback";

describe("Form Leave Guard Mixin", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: Wrapper<Vue & { [key: string]: any }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let beforeRouteLeave: (to: any, from: any, next: () => void) => void;

  // Setup the component with mixin before each test
  const beforeHandler = () => {
    wrapper = mountComponent(formName);
    // TODO: Possibly fix by adding 'beforeRouteLeave' to the vm options...
    // @ts-ignore
    ({ beforeRouteLeave } = wrapper.vm.$options);
  };

  const afterHandler = () => {
    wrapper.destroy();
    nextFn.mockReset();
  };

  beforeEach(beforeHandler);
  afterEach(afterHandler);

  it("should run mixin in component", () => {
    // Should import successfully
    expect(FormGuardMixin).toBeTruthy();
    // Should have active key
    expect(wrapper.vm[activeKey]).toBe(false);
    // Should have callback key
    expect(wrapper.vm[callbackKey]).toBeNull();
  });

  it("should handle leaving clean form", () => {
    beforeRouteLeave.call(wrapper.vm, "toObj", "fromObj", nextFn);

    // Should call "next" when leaving clean form
    expect(nextFn).toHaveBeenCalled();
    // Should not set active key when leaving clean form
    expect(wrapper.vm[activeKey]).toBe(false);
    // Should not set callback handler when leaving clean form
    expect(wrapper.vm[callbackKey]).toBeNull();
  });

  // TODO: Tests likely fail because of "beforeRouteLeave" not getting triggered?
  /*describe("should handle leaving dirty form", () => {
    beforeEach(() => {
      beforeHandler();

      // Make changes to form (to trigger "changed" flag)
      wrapper.vm[formName].setValues({ ...fieldChanges });
      beforeRouteLeave.call(wrapper.vm, "toObj", "fromObj", nextFn);
    });
    afterEach(afterHandler);

    it("should prevent leaving dirty form", async () => {
      // Should not call "next" when leaving dirty form
      expect(nextFn).not.toHaveBeenCalled();
      // Should set "is leaving" active getter
      expect(wrapper.vm[activeKey]).toBe(true);
      // Should set form leave confirmation callback
      expect(wrapper.vm[callbackKey]).not.toBeNull();

      // Should remove callback after it is the setter is called (v-model issue)
      wrapper.vm[activeKey] = false;
      expect(wrapper.vm[callbackKey]).not.toBeNull();
      await Vue.nextTick();
      expect(wrapper.vm[callbackKey]).toBeNull();
    });

    it("should remain on dirty form after cancellation", () => {
      wrapper.vm[callbackKey]();

      // Should reset callback key when staying on dirty form
      expect(wrapper.vm[callbackKey]).toBeNull();
      // Should not call "next" when staying on dirty form
      expect(nextFn).not.toHaveBeenCalled();
    });

    it("should leave dirty form after confirmation", () => {
      wrapper.vm[callbackKey](true);

      // Should reset callback key when leaving dirty form
      expect(wrapper.vm[callbackKey]).toBeNull();
      // Should call "next" when leaving dirty form
      expect(nextFn).toHaveBeenCalled();
      // Should reset form state when leaving dirty form
      expect(wrapper.vm[formName].getValues()).toEqual(fields);
    });
  });*/
});
