import Vue from "vue";
import { shallowMount } from "@vue/test-utils";

// Utilities
import { FormCreateMixin, FormLeaveGuardMixin } from "../src";

const nextFn = jest.fn();
const onPreventFn = jest.fn();
const Component = Vue.component("formComponent", {
  template: "<div />",
});

/**
 * Shallow mount a component with the mixin (and custom options)
 * @param  {string} formKey      - Form key
 * @param  {Object} mixinOptions - Mixin options
 * @return                       - Vue wrapper
 */
const mountComponent = (formKey, mixinOptions = {}) =>
  shallowMount(Component, {
    mixins: [
      // NOTE: Must spread setup values to avoid mutating by reference!
      FormCreateMixin(formName, { ...fields }),
      FormLeaveGuardMixin(formKey, {
        activeKey,
        callbackKey,
        onPrevent: onPreventFn,
        ...mixinOptions,
      }),
    ],
  });

const formName = "form";
const fields = {
  email: "test@example.com",
  password: "******",
};
const fieldChanges = {
  email: "noone@example.com",
};

const activeKey = "isLeavingForm";
const callbackKey = "onFormLeave";

describe("Form Leave Guard Mixin", () => {
  let wrapper = null;
  let beforeRouteLeave = null;

  // Setup the component with mixin before each test
  const beforeHandler = () => {
    wrapper = mountComponent(formName);
    ({ beforeRouteLeave } = wrapper.vm.$options);
  };

  const afterHandler = () => {
    wrapper.destroy();
    nextFn.mockReset();
    onPreventFn.mockReset();
  };

  beforeEach(beforeHandler);
  afterEach(afterHandler);

  it("should run mixin in component", () => {
    // Should import successfully
    expect(FormLeaveGuardMixin).toBeTruthy();
    // Should have active key from mixin options
    expect(wrapper.vm[activeKey]).toBe(false);
    // Should have callback key from mixin options
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
    // Should not call custom prevent handler when leaving clean form
    expect(onPreventFn).not.toHaveBeenCalled();
  });

  it("should handle leaving clean forms (multiple)", () => {
    const wrapperMulti = mountComponent([formName]);
    // TODO: Possibly fix by adding 'beforeRouteLeave' to the vm options...
    // @ts-ignore
    const beforeRouteLeaveMulti = wrapperMulti.vm.$options.beforeRouteLeave;
    beforeRouteLeaveMulti.call(wrapperMulti.vm, "toObj", "fromObj", nextFn);

    // Should call "next" when leaving clean forms
    expect(nextFn).toHaveBeenCalled();
    // Should not set active key when leaving clean forms
    expect(wrapperMulti.vm[activeKey]).toBe(false);
    // Should not set callback handler when leaving clean forms
    expect(wrapperMulti.vm[callbackKey]).toBeNull();
    // Should not call custom prevent handler when leaving clean forms
    expect(onPreventFn).not.toHaveBeenCalled();
  });

  describe("should handle leaving dirty form", () => {
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

    it("should leave dirty forms (multiple) after confirmation", () => {
      const wrapperMulti = mountComponent([formName]);
      // TODO: Possibly fix by adding 'beforeRouteLeave' to the vm options...
      // @ts-ignore
      const beforeRouteLeaveMulti = wrapperMulti.vm.$options.beforeRouteLeave;
      wrapperMulti.vm[formName].setValues({ ...fieldChanges });
      beforeRouteLeaveMulti.call(wrapperMulti.vm, "toObj", "fromObj", nextFn);
      wrapperMulti.vm[callbackKey](true);

      // Should reset callback key when leaving dirty form
      expect(wrapperMulti.vm[callbackKey]).toBeNull();
      // Should call "next" when leaving dirty form
      expect(nextFn).toHaveBeenCalled();
      // Should reset form state when leaving dirty form
      expect(wrapperMulti.vm[formName].getValues()).toEqual(fields);
    });
  });

  it("should prevent leaving dirty form (without callbacks) if specified", () => {
    const wrapperPrevent = mountComponent(formName, {
      onlyPrevent: true,
    });
    // TODO: Possibly fix by adding 'beforeRouteLeave' to the vm options...
    // @ts-ignore
    const beforeRouteLeavePrevent = wrapperPrevent.vm.$options.beforeRouteLeave;

    wrapperPrevent.vm[formName].setValues({ ...fieldChanges });
    beforeRouteLeavePrevent.call(wrapperPrevent.vm, "toObj", "fromObj", nextFn);

    // Should not call "next" when only preventing leaving dirty form
    expect(nextFn).not.toBeCalled();
    // Should not set callback when only preventing leaving dirty form
    expect(wrapperPrevent.vm[callbackKey]).toBeNull();
    // Should call custom prevent handler when only preventing leaving dirty form
    expect(onPreventFn).toBeCalled();
  });
});
