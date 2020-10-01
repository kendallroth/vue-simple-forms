/**
 * NOTE: Use 'FormGuardMixin' mixin with TypeScript instead (this mixin is not typed)!
 */

// Types
import { Form } from "./createForm";

export interface FormMixin {
  // Dynamic form name
  [name: string]: Form;
}

export interface FormLeaveOptions {
  activeKey?: string;
  callbackKey?: string;
  onlyPrevent?: boolean;
  onPrevent?: (callback?: () => void) => void;
}

/**
 * Prevent leaving a route with unsaved changes
 * @param {string|string[]} formKeys            - Form state key(s)
 * @param {Object}          options             - Guard configuration options
 * @param {string}          options.activeKey   - Form leave active state key
 * @param {string}          options.callbackKey - Callback method key
 * @param {boolean}         options.onlyPrevent - Only prevent leaving route (no "active" state)
 * @param {function}        options.onPrevent   - Prevention handler (for custom handling)
 */
const FormLeaveGuardMixin = (
  formKeys: string[],
  options?: FormLeaveOptions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any => {
  // eslint-disable-next-line no-console
  console.warn("'FormLeaveGuardMixin' is deprecated (no type support) - use 'FormGuardMixin' instead!");

  const {
    activeKey = "isLeaveFormActive",
    callbackKey = "formLeaveCallback",
    onlyPrevent = false,
    onPrevent,
  } = options || {};

  return {
    data() {
      return {
        [callbackKey]: null,
      };
    },
    computed: {
      [activeKey]: {
        get(): boolean {
          // @ts-ignore
          return Boolean(this[callbackKey]);
        },
        set(val: boolean): void {
          // Can only set to inactive, since setting to "active" requires a "next()" callback!
          if (!val) {
            // Must wait until next tick to avoid clearing callback before calling
            // @ts-ignore
            this.$nextTick(() => {
              // @ts-ignore
              this[callbackKey] = null;
            });
          }
        },
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beforeRouteLeave(to: any, from: any, next: () => void) {
      // Check all supplied forms for unsaved changes
      if (typeof formKeys === "string") {
        const isClean = checkFormClean(this, formKeys);
        if (isClean) return next();
      } else if (Array.isArray(formKeys)) {
        const areAllClean = formKeys.every((key) =>
          checkFormClean(this, key)
        );
        if (areAllClean) return next();
      } else {
        /* istanbul ignore next - Uncommon case */
        return next();
      }

      // The "onlyPrevent" option only prevents leaving with unsaved data,
      //   and does not manage any additional "active" status.
      if (onlyPrevent) {
        // Call the prevention handler with no callback (ie. no "next()")
        onPrevent && onPrevent();
        return;
      }

      /**
       * Callback to determine whether leaving form is allowed
       * @param {boolean} shouldContinue - Whether to leave the form
       */
      const callback = (shouldContinue = false) => {
        // Prevent calling twice (from here and "onPrevent" handler)
        if (!this[callbackKey]) return;
        this[callbackKey] = null;

        if (shouldContinue) {
          // Reset the form before leaving (otherwise it sometimes retains data)
          if (Array.isArray(formKeys)) {
            formKeys.forEach((key) => resetForm(this, key));
          } else {
            resetForm(this, formKeys);
          }

          return next();
        }
      };

      // Set the callback and pass the reference to the "onPrevent" callback
      this[callbackKey] = callback;
      onPrevent && onPrevent(callback);
    },
  };
};

/**
 * Check whether a form has any unsaved changes
 * @param  {Object}  that    - Calling 'this' context
 * @param  {string}  formKey - Form state key
 * @return {boolean}         - Whether form is clean
 */
function checkFormClean(that: FormMixin, formKey: string) {
  const form = that[formKey];
  if (!form) return true;

  return !form.flags.changed && !form.flags.submitting;
}

/**
 * Reset a form
 * @param {Object} that    - Calling 'this' context
 * @param {string} formKey - Form state key
 */
function resetForm(that: FormMixin, formKey: string) {
  const form = that[formKey];
  if (!form) return;

  form.reset();
}

export { FormLeaveGuardMixin };
