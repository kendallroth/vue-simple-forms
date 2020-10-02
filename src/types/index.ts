/**
 * Form field values
 */
export interface FormFields {
  [name: string]: string | number | null;
}

/**
 * Form options when creating form
 */
export interface FormOptions {
  /**
   * Whether the form should calculate changed values (performance)
   */
  calculateChanged?: boolean;
  /**
   * Form flag default values and additional flags
   */
  flags?: FormOptionsFlags;
}

/**
 * Form flags passed as options when creating form
 */
export interface FormOptionsFlags {
  // Necessary to allow custom flags
  [key: string]: boolean | undefined;
  /**
   * Whether the form has changed
   */
  changed?: boolean;
  /**
   * Whether the form is disabled
   */
  disabled?: boolean;
  /**
   * Whether the form is loading
   */
  loading?: boolean;
  /**
   * Whether the form is submitting
   */
  submitting?: boolean;
}

/**
 * Form flags
 */
export interface FormFlags {
  // Necessary to allow referencing as 'this.flags[flag]'...
  [key: string]: boolean | undefined;
  /**
   * Whether the form has changed
   */
  changed?: boolean;
  /**
   * Whether the form is disabled
   */
  disabled: boolean;
  /**
   * Whether the form is loading
   */
  loading: boolean;
  /**
   * Whether the form is submitting
   */
  submitting: boolean;
}

/**
 * Form values/flags and helpers
 */
export interface Form {
  /**
   * Form flags
   */
  flags: FormFlags;
  /**
   * Form field values
   */
  fields: FormFields;
  /**
   * Initial form values
   */
  _initial: FormFields;
  /**
   * Get the form values
   * @return Form values
   */
  getValues: () => FormFields;
  /**
   * Set a form flag
   * @param flag  - Form flag name
   * @param value - Form flag value
   */
  setFlag: (flag: string, value: boolean) => void;
  /**
   * Set the form current and initial values
   * @param values - New form values
   */
  setInitial: (values: FormFields) => void;
  /**
   * Set whether the form is loading
   * @param isLoading - Whether form is loading
   */
  setLoading: (isLoading: boolean) => void;
  /**
   * Set whether the form is submitting
   * @param isSubmitting - Whether form is submitting
   */
  setSubmitting: (isSubmitting: boolean) => void;
  /**
   * Set the form values
   * @param values     - New form values
   * @param setInitial - Whether initial values should be updated
   */
  setValues: (values: FormFields, setInitial?: boolean) => void;
  /**
   * Reset the form to its initial values
   */
  reset: () => void;
}
