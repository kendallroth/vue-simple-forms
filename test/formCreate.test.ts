import Vue from "vue";
import { shallowMount, Wrapper } from "@vue/test-utils";

// Utilities
import { createForm } from "../src";

describe("Form Create Mixin", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let wrapper: Wrapper<Vue & { [key: string]: any }>;
  const Component = Vue.component("formComponent", {
    template: "<div />",
  });

  const formName = "form";
  const fields = {
    email: "test@example.com",
    password: "******",
  };
  const fieldChanges = {
    email: "noone@example.com",
  };
  const updatedFields = {
    ...fields,
    ...fieldChanges,
  };

  // Setup the component data before each test
  const beforeHandler = () => {
    wrapper = shallowMount(Component, {
      // NOTE: Must spread setup values to avoid mutating by reference!
      data() {
        return {
          [formName]: createForm({ ...fields }),
        };
      },
    });
  };

  const afterHandler = () => {
    wrapper.destroy();
  };

  beforeEach(beforeHandler);
  afterEach(afterHandler);

  it("should run function in component", () => {
    // Should import successfully
    expect(createForm).toBeTruthy();
    // Should have form data key from mixin options
    expect(wrapper.vm).toHaveProperty(formName);
  });

  it("should populate fields from function options", () => {
    // Should have field values from function options
    expect(wrapper.vm[formName].fields).toEqual(fields);
    // Should have matching initial values
    expect(wrapper.vm[formName]._initial).toEqual(fields);
  });

  it("should populate initial flags", () => {
    expect(wrapper.vm[formName].flags).toMatchObject({
      changed: false,
      disabled: false,
      loading: false,
      submitting: false,
    });
  });

  describe("should handle form data methods", () => {
    beforeEach(beforeHandler);
    afterEach(afterHandler);

    it("'should get form values", () => {
      expect(wrapper.vm[formName].getValues()).toEqual(fields);
    });

    it("should update form values (but not initial)", () => {
      wrapper.vm[formName].setValues({ ...fieldChanges });
      expect(wrapper.vm[formName].getValues()).toEqual(updatedFields);
      expect(wrapper.vm[formName]._initial).toEqual(fields);
    });

    it("should update form values (and initial)", () => {
      // Should set form values and update initial values
      wrapper.vm[formName].setValues({ ...fieldChanges }, true);
      expect(wrapper.vm[formName].getValues()).toEqual(updatedFields);
      expect(wrapper.vm[formName]._initial).toEqual(updatedFields);

      // Should use new initial values in reset
      wrapper.vm[formName].reset();
      expect(wrapper.vm[formName].getValues()).toEqual(updatedFields);
    });

    it("should reset form values", () => {
      wrapper.vm[formName].setValues({ ...fieldChanges });
      expect(wrapper.vm[formName].getValues()).toEqual(updatedFields);
      wrapper.vm[formName].reset();
      expect(wrapper.vm[formName].getValues()).toEqual(fields);
    });
  });

  describe("should handle form flag methods", () => {
    beforeEach(beforeHandler);
    afterEach(afterHandler);

    it("should not set invalid flags", () => {
      wrapper.vm[formName].setFlag("locked", true);
      expect(wrapper.vm[formName].flags.locked).toBeUndefined();
    });

    it("should set submitting flag", () => {
      // Should set form submitting flag (both values)
      wrapper.vm[formName].setSubmitting(true);
      expect(wrapper.vm[formName].flags.submitting).toEqual(true);
      wrapper.vm[formName].setSubmitting(false);
      expect(wrapper.vm[formName].flags.submitting).toEqual(false);
    });

    it("should set loading flag", () => {
      // Should set form loading flag (both values)
      wrapper.vm[formName].setLoading(true);
      expect(wrapper.vm[formName].flags.loading).toEqual(true);
      wrapper.vm[formName].setLoading(false);
      expect(wrapper.vm[formName].flags.loading).toEqual(false);
    });
  });

  describe("should handle form computed flags", () => {
    beforeEach(beforeHandler);
    afterEach(afterHandler);

    it("should calculate computed 'changed' flag", () => {
      // Should start unchanged
      expect(wrapper.vm[formName].flags.changed).toEqual(false);

      // Should update form 'changed' key
      wrapper.setData({ [formName]: { fields: { ...fieldChanges } } });
      expect(wrapper.vm[formName].flags.changed).toEqual(true);
    });

    it("should track computed 'changed' flag through changes", () => {
      // Should update form data and 'changed' key
      wrapper.setData({ [formName]: { fields: { ...fieldChanges } } });
      expect(wrapper.vm[formName].flags.changed).toEqual(true);

      // Should reset form and 'changed' key
      wrapper.vm[formName].reset();
      expect(wrapper.vm[formName].flags.changed).toEqual(false);
    });
  });

  describe("should use optional mixin options", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let wrapperStatic: Wrapper<Vue & { [key: string]: any }>;

    beforeEach(() => {
      const options = { calculateChanged: false, flags: { locked: true } };
      wrapperStatic = shallowMount(Component, {
        // NOTE: Must spread setup values to avoid mutating by reference!
        data() {
          return {
            [formName]: createForm({ ...fields }, options),
          };
        },
      });
    });
    afterEach(() => {
      wrapperStatic.destroy();
    });

    it("should use custom flags", () => {
      // Should have custom flag set by mixin
      expect(wrapperStatic.vm[formName].flags).toHaveProperty("locked", true);
    });

    it("should set custom form flag", () => {
      wrapperStatic.vm[formName].setFlag("locked", false);
      expect(wrapperStatic.vm[formName].flags.locked).toEqual(false);
    });

    it("should avoid calculating 'changed' flag", () => {
      wrapperStatic.setData({ [formName]: { fields: { ...fieldChanges } } });
      expect(wrapperStatic.vm[formName].flags.changed).toBeUndefined();
    });
  });
});
