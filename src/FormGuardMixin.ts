/**
 * NOTE: This component requires a 'data' property to be set in order
 *         to know which forms to check (guardedForms[]).
 */

import { Component, Vue } from "vue-property-decorator";

// Types
import { Form } from "./types";

/**
 * Mixin to prevent leaving a form with unsaved changes (using routing)
 *
 * The mixin provides several properties to assist with prompting the user
 *   to confirm/cancel form navigation.
 */
@Component({
  // NOTE: Necessary to avoid Vue component name issues with minified code!
  name: "FormGuardMixin"
})
class FormGuardMixin extends Vue {
  // TODO: Possibly configure via router 'props'?

  formLeaveCallback: ((leave: boolean) => void) | null = null;

  get forms(): Form[] {
    return this.$data.guardedForms || [];
  }

  /**
   * Whether the form leave guard is active
   *
   * This can be used to control a confirmation dialog, etc...
   */
  get isFormGuardActive(): boolean {
    return Boolean(this.formLeaveCallback);
  }

  /**
   * Set whether the form leave guard is active
   *
   * NOTE: This should not be set manually but as part of confirmation process!
   */
  set isFormGuardActive(val: boolean) {
    // Can only set to inactive, since setting to "active" requires a "next()" callback!
    if (!val) {
      // Must wait until next tick to avoid clearing callback before calling
      // @ts-ignore
      this.$nextTick(() => {
        this.formLeaveCallback = null;
      });
    }
  }

  // TODO: Possibly implement via router 'props'?
  get onlyPrevent(): boolean {
    return false;
  }

  /**
   * Handler to determine whether the form navigation should be continued/cancelled
   * @param shouldLeave - Whether form navigation should continue (will reset form)
   *
   * NOTE: This will call the previously interupted "next" route method.
   */
  onFormLeave(shouldLeave: boolean): void {
    if (!this.formLeaveCallback) return;

    this.formLeaveCallback(shouldLeave);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  beforeRouteLeave(to: any, from: any, next: () => void): void {
    // Check all supplied forms for unsaved changes
    const areAllClean = checkForms(this.forms);
    if (areAllClean) return next();

    // The "onlyPrevent" option only prevents leaving with unsaved data,
    //   and does not manage any additional "active" status.
    if (this.onlyPrevent) return;

    /**
     * Callback to determine whether leaving form is allowed
     * @param {boolean} shouldContinue - Whether to leave the form
     */
    const callback = (shouldContinue = false) => {
      // Prevent calling twice (from here and "onPrevent" handler)
      if (!this.formLeaveCallback) return;
      this.formLeaveCallback = null;

      if (shouldContinue) {
        // Reset the form before leaving (otherwise it sometimes retains data)
        resetForms(this.forms);

        return next();
      }
    };

    // Set the callback and pass the reference to the "onPrevent" callback
    this.formLeaveCallback = callback;
  }
}

/**
 * Check whether a form has any unsaved changes
 * @ignore
 * @param   {Object}  form - Form state
 * @returns {boolean}      - Whether form is clean
 */
function checkForms(forms: Form[]): boolean {
  if (!forms || !Array.isArray(forms)) return true;

  return forms.every((form) => {
    if (!form || !form.flags) return true;
    return !form.flags.changed && !form.flags.submitting;
  });
}

/**
 * Reset a form
 * @ignore
 * @param {Object} form - Form state
 */
function resetForms(forms: Form[]): void {
  if (!forms || !Array.isArray(forms)) return;

  forms.forEach((form) => {
    if (!form || !form.reset) return;
    form.reset();
  });
}

/* eslint @typescript-eslint/no-use-before-define: off */

export { FormGuardMixin };
