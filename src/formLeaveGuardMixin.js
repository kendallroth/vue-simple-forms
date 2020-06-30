/**
 * Prevent leaving a route with unsaved changes
 * @param {string|string[]} formKeys            - Form state key(s)
 * @param {Object}          options             - Guard configuration options
 * @param {string}          options.activeKey   - Form leave active state key
 * @param {string}          options.callbackKey - Callback method key
 * @param {boolean}         options.onlyPrevent - Only prevent leaving route (no "active" state)
 * @param {function}        options.onPrevent   - Prevention handler (for custom handling)
 */
const FormLeaveGuardMixin = (formKeys, options = {}) => {
  const {
    activeKey = "isLeaveFormActive",
    callbackKey = "formLeaveCallback",
    onlyPrevent = false,
    onPrevent = () => {},
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
          // Can only set to inactive, since setting to "active" requires a "next()" callback!
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
          formKeys.forEach((key) => resetForm.call(this, key));

          return next();
        }
      };

      // Set the callback and pass the reference to the "onPrevent" callback
      this[callbackKey] = callback;
      onPrevent(callback);
    },
  };
};

/**
 * Check whether a form has any unsaved changes
 * @param  {string}  formKey - Form state key
 * @return {boolean}         - Whether form is clean
 */
function checkFormClean(formKey) {
  const form = this[formKey];
  if (!form) return true;

  return !form.flags.changed && !form.flags.submitting;
}

/**
 * Reset a form
 * @param {string} formKey - Form state key
 */
function resetForm(formKey) {
  const form = this[formKey];
  if (!form) return;

  form.reset();
}

export { FormLeaveGuardMixin };
