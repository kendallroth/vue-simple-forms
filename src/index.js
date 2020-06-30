/**
 * Create a Vue form
 *
 * NOTE: Form tracks whether any values have changed via "flags.changed",
 *         which is more reliable than the VeeValidate flags.
 *
 * @param  {string} name   - Form name ('data' key)
 * @param  {Object} fields - Form fields and initial values
 * @return {Object}        - Vue form
 */
function createForm(name, fields) {
  const form = {
    [name]: {
      // Clone the fields to set as initial values (for reset)
      _initial: { ...fields },
      flags: {
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
      _setFlag(flag, value) {
        this.flags[flag] = value;
      },
      /**
       * Set whether the form is loading
       * @param {boolean} isLoading - Whether form is loading
       */
      setLoading(isLoading) {
        this._setFlag("loading", isLoading);
      },
      /**
       * Set whether the form is submitting
       * @param {boolean} isSubmitting - Whether form is submitting
       */
      setSubmitting(isSubmitting) {
        this._setFlag("submitting", isSubmitting);
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
  const boundGetChanged = getChanged.bind(form[name]);

  Object.defineProperty(form[name].flags, "changed", {
    get: boundGetChanged,
  });

  return form;
}

export { createForm };

/* eslint no-underscore-dangle: off */
