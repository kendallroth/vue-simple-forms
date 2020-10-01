/**
 * NOTE: Use 'createForm' function with TypeScript instead (this mixin is not typed)!
 */

// Utilities
import { createForm, FormFields, FormOptions } from "./createForm";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => ({
  data() {
    return {
      [name]: createForm.call(this, fields, options),
    };
  },
});

export { createForm, FormCreateMixin };

/* eslint no-underscore-dangle: off */
