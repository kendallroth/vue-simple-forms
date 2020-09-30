export interface FormFields {
  [name: string]: string | number | null;
}

export interface FormOptions {
  calculateChanged?: boolean;
  flags?: FormOptionsFlags;
}

export interface FormOptionsFlags {
  // Necessary to allow custom flags
  [key: string]: boolean | undefined;
  changed?: boolean;
  disabled?: boolean;
  loading?: boolean;
  submitting?: boolean;
}

export interface FormFlags {
  // Necessary to allow referencing as 'this.flags[flag]'...
  [key: string]: boolean | undefined;
  changed?: boolean;
  disabled: boolean;
  loading: boolean;
  submitting: boolean;
}

export interface Form {
  flags: FormFlags;
  fields: FormFields;
  _initial: FormFields;
  getValues: () => FormFields;
  setFlag: (flag: string, value: boolean) => void;
  setInitial: (values: FormFields) => void;
  setLoading: (isLoading: boolean) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setValues: (values: FormFields, setInitial?: boolean) => void;
  reset: () => void;
}

/**
 * Create a Vue form
 *
 * @param  {Object} fields  - Form fields and initial values
 * @param  {Object} options - Form configuration options
 */
const createForm = (fields: FormFields, options?: FormOptions): Form => {
  const { calculateChanged = true, flags } = options || {};

  const formFlags: FormFlags = {
    // Allow tracking additional flags
    ...(flags || {}),
    // NOTE: Declared even though overridden so that it is tracked by object
    changed: false,
    get disabled(): boolean {
      return this.loading || this.submitting;
    },
    loading: false,
    submitting: false,
  };

  const form: Form = {
    // Clone the fields to set as initial values (for reset)
    _initial: { ...fields },
    flags: formFlags,
    fields,
    /**
     * Get the form values
     * @return {Object} - Form values
     */
    getValues(): FormFields {
      return this.fields;
    },
    /**
     * Set a form flag
     * @param {string}  flag  - Form flag name
     * @param {boolean} value - Form flag value
     */
    setFlag(flag: string, value: boolean): void {
      // Only set flags that exist or are custom!
      if (this.flags[flag] === undefined) return;

      this.flags[flag] = Boolean(value);
    },
    /**
     * Set the form current and initial values
     * @param {Object} values - New form values
     */
    setInitial(values: FormFields): void {
      this.setValues(values, true);
    },
    /**
     * Set whether the form is loading
     * @param {boolean} isLoading - Whether form is loading
     */
    setLoading(isLoading: boolean): void {
      this.setFlag("loading", isLoading);
    },
    /**
     * Set whether the form is submitting
     * @param {boolean} isSubmitting - Whether form is submitting
     */
    setSubmitting(isSubmitting: boolean): void {
      this.setFlag("submitting", isSubmitting);
    },
    /**
     * Set the form values
     * @param {Object}  values     - New form values
     * @param {boolean} setInitial - Whether initial values should be updated
     */
    setValues(values: FormFields, setInitial = false): void {
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
    reset(): void {
      Object.keys(this._initial).forEach((key) => {
        const initialValue = this._initial[key];
        this.fields[key] = initialValue;
      });
    },
  };

  /**
   * Determine whether any form fields have changed
   * @return {boolean} - Whether any fields have changed
   */
  const getChanged = (): boolean => {
    return Object.keys(form.fields).some((fieldKey) => {
      const fieldValue = form.fields[fieldKey];
      const initialValue = form._initial[fieldKey];
      return fieldValue !== initialValue;
    });
  };

  // Only calculate "changed" property if necessary (default)
  if (calculateChanged) {
    // Need to bind "this" context since "Object.defineProperty" uses the base object!
    const boundGetChanged = getChanged.bind(form);

    Object.defineProperty(form.flags, "changed", {
      get: boundGetChanged,
    });
  } else {
    delete form.flags.changed;
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
const FormCreateMixin = (
  name: string,
  fields: FormFields,
  options?: FormOptions
): any => ({
  data() {
    return {
      [name]: createForm.call(this, fields, options),
    };
  },
});

export { createForm, FormCreateMixin };

/* eslint no-underscore-dangle: off */
