/**
 * Create a Vue form
 *
 * @param  {string} name    - Form name ('data' key)
 * @param  {Object} fields  - Form fields and initial values
 * @param  {Object} options - Form configuration options
 */
const createForm = (name, fields, options = {}) => {
  const { calculateChanged = true, flags = {} } = options;

  const form = {
    [name]: {
      // Clone the fields to set as initial values (for reset)
      _initial: { ...fields },
      flags: {
        // Allow tracking additional flags
        ...flags,
        // NOTE: Declared even though overridden so that it is tracked by object
        changed: false,
        get disabled() {
          return this.loading || this.submitting;
        },
        loading: false,
        submitting: false,
      },
      fields,
      /**
       * Get the form values
       * @return {Object} - Form values
       */
      getValues() {
        return this.fields;
      },
      /**
       * Set a form flag
       * @param {string}  flag  - Form flag name
       * @param {boolean} value - Form flag value
       */
      setFlag(flag, value) {
        // Only set flags that exist or are custom!
        if (this.flags[flag] === undefined) return;

        this.flags[flag] = Boolean(value);
      },
      /**
       * Set whether the form is loading
       * @param {boolean} isLoading - Whether form is loading
       */
      setLoading(isLoading) {
        this.setFlag("loading", isLoading);
      },
      /**
       * Set whether the form is submitting
       * @param {boolean} isSubmitting - Whether form is submitting
       */
      setSubmitting(isSubmitting) {
        this.setFlag("submitting", isSubmitting);
      },
      /**
       * Set the form values
       * @param {Object}  values     - New form values
       * @param {boolean} setInitial - Whether initial values should be updated
       */
      setValues(values, setInitial = true) {
        Object.keys(values).forEach((key) => {
          const fieldValue = values[key];
          this.fields[key] = fieldValue;
        });

        // Optionally set the new values as the initial values (default)
        // NOTE: This doesn't work too well with VeeValidate "changed" flag,
        //         but the form flag "changed" should be used anyway.
        if (setInitial) {
          Object.keys(values).forEach((key) => {
            const fieldValue = values[key];
            this._initial[key] = fieldValue;
          });
        }
      },
      /**
       * Reset the form to its initial values
       */
      reset() {
        Object.keys(this._initial).forEach((key) => {
          const initialValue = this._initial[key];
          this.fields[key] = initialValue;
        });
      },
    },
  };

  /**
   * Determine whether any form fields have changed
   * @return {boolean} - Whether any fields have changed
   */
  function getChanged() {
    return Object.keys(this.fields).some((fieldKey) => {
      const fieldValue = this.fields[fieldKey];
      const initialValue = this._initial[fieldKey];
      return fieldValue !== initialValue;
    });
  }

  // Only calculate "changed" property if necessary (default)
  if (calculateChanged) {
    // Need to bind "this" context since "Object.defineProperty" uses the base object!
    const boundGetChanged = getChanged.bind(form[name]);

    Object.defineProperty(form[name].flags, "changed", {
      get: boundGetChanged,
    });
  } else {
    delete form[name].flags.changed;
  }

  return form;
};

/**
 * Vue form state management mixin
 *
 * @param {string}  name                     - Form name ('data' key)
 * @param {Object}  fields                   - Form fields and initial values
 * @param {Object}  options                  - Form configuration options
 * @param {boolean} options.calculateChanged - Whether form "changed" flag is calculated
 * @param {Object}  options.flags            - Additional custom flags
 */
const FormCreateMixin = (name, fields, options) => ({
  data() {
    return {
      ...createForm.call(this, name, fields, options),
    };
  },
});

export { createForm, FormCreateMixin };

/* eslint no-underscore-dangle: off */
