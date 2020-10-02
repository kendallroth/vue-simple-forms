import { Form, FormFields, FormFlags, FormOptions } from "./types";

/**
 * Create a Vue form with reactive data and helper methods
 *
 * @param   {FormFields}  fields  - Form fields and initial values
 * @param   {FormOptions} options - Form configuration options
 * @returns {Form}        Vue form
 */
export const createForm = (fields: FormFields, options?: FormOptions): Form => {
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
    getValues(): FormFields {
      return this.fields;
    },
    setFlag(flag: string, value: boolean): void {
      // Only set flags that exist or are custom!
      if (this.flags[flag] === undefined) return;

      this.flags[flag] = Boolean(value);
    },
    setInitial(values: FormFields): void {
      this.setValues(values, true);
    },
    setLoading(isLoading: boolean): void {
      this.setFlag("loading", isLoading);
    },
    setSubmitting(isSubmitting: boolean): void {
      this.setFlag("submitting", isSubmitting);
    },
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
