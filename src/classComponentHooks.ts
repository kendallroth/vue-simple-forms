/**
 * Register several hooks provided by components
 *   - Vue Router navigation guards
 *
 * Taken from: https://class-component.vuejs.org/guide/additional-hooks.html
 */

import Component from "vue-class-component";

// Register the router hooks with their names
Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate",
]);
