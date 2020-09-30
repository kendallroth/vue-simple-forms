import Vue from "vue";
import { shallowMount } from "@vue/test-utils";

// Utilities
import { createForm, FormCreateMixin } from "../src";

describe("Form Create Mixin", () => {
  let wrapper = null;
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

  // Setup the component with mixin before each test
  const beforeHandler = () => {
    wrapper = shallowMount(Component, {
      mixins: [
        // NOTE: Must spread setup values to avoid mutating by reference!
        FormCreateMixin(formName, { ...fields }),
      ],
    });
  };

  const afterHandler = () => {
    wrapper.destroy();
  };

  beforeEach(beforeHandler);
  afterEach(afterHandler);

  it("should run mixin in component", () => {
    // Should import successfully
    expect(FormCreateMixin).toBeTruthy();
    // Should have form data key from mixin options
    expect(wrapper.vm).toHaveProperty(formName);
  });

  it("should populate fields from mixin options", () => {
    // Should have field values from mixin options
    expect(wrapper.vm[formName].fields).toEqual(fields);
    // Should have matching initial valuse
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
    let wrapperStatic = null;

    beforeEach(() => {
      const options = { calculateChanged: false, flags: { locked: true } };
      wrapperStatic = shallowMount(Component, {
        mixins: [
          // NOTE: Must spread setup values to avoid mutating by reference!
          FormCreateMixin(formName, { ...fields }, options),
        ],
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

describe("Form Create Function", () => {
  let wrapper = null;

  const formName = "form";
  const fields = {
    email: "test@example.com",
    password: "******",
  };

  // Setup the component with mixin before each test
  const beforeHandler = () => {
    const Component = Vue.component("testComponent", {
      template: "<div />",
    });

    wrapper = shallowMount(Component, {
      // Form function with initial fields and custom flags
      // NOTE: Must spread setup values to avoid mutating by reference!
      data() {
        return {
          [formName]: createForm({ ...fields }),
        };
      },
    });
  };

  beforeEach(beforeHandler);
  afterEach(() => {
    wrapper.destroy();
  });

  // NOTE: Only this test is necessary, since the Mixin uses this function underneath!
  it("should run mixin in component", () => {
    // Should import successfully
    expect(createForm).toBeTruthy();
    // Should have form data key from mixin options
    expect(wrapper.vm).toHaveProperty(formName);
  });
});
