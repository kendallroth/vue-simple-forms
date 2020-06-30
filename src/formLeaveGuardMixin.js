/**
 * Prevent leaving a route with unsaved changes
 * @param {string|string[]} formKeys            - Form state key(s)
 * @param {Object}          options             - Guard configuration options
 * @param {string}          options.activeKey   - Form leave active state key
 * @param {string}          options.callbackKey - Callback method key
 */
const FormLeaveGuardMixin = (formKeys, options = {}) => {
  const {
    activeKey = "isLeaveFormActive",
    callbackKey = "formLeaveCallback",
  } = options;

  return {
    data() {
      return {
        [callbackKey]: null,
      };
    },
    computed: {
      [activeKey]: {
        get() {
          return Boolean(this[callbackKey]);
        },
        set(val) {
          // Only set to inactive (never active)!
          if (!val) {
            // Must wait until next tick to avoid clearing callback before calling
            this.$nextTick(() => {
              this[callbackKey] = null;
            });
          }
        },
      },
    },
    beforeRouteLeave(to, from, next) {
      // Check all supplied forms for unsaved changes
      if (typeof formKeys === "string") {
        const isClean = checkFormClean.call(this, formKeys);
        if (isClean) return next();
      } else if (Array.isArray(formKeys)) {
        const areAllClean = formKeys.every((key) =>
          checkFormClean.call(this, key)
        );
        if (areAllClean) return next();
      } else {
        return next();
      }

      /**
       * Callback for route leave confirmation dialog
       * @param {bool} shouldContinue - Whether to leave route
       */
      this[callbackKey] = (shouldContinue = false) => {
        this[callbackKey] = null;

        if (shouldContinue) {
          return next();
        }
      };
    },
  };
};

/**
 * Check whether a form has any unsaved changes
 * @param {string} formKey - Form state key
 */
function checkFormClean(formKey) {
  const form = this[formKey];
  if (!form) return true;

  return !form.flags.changed && !form.flags.submitting;
}

export { FormLeaveGuardMixin };
