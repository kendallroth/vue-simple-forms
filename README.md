# Vue Forms

![](https://github.com/kendallroth/vue-simple-forms/workflows/Jest%20Test/badge.svg)

Simple Vue form state management library (no validation, etc).

- [`FormCreateMixin`](#formcreatemixin)
- [`FormLeaveGuardMixin`](#formleaveguardmixin)

```sh
npm install @kendallroth/vue-simple-forms --save
```

## Features

- Create reactive Vue data for forms
- Track basic form fields
- Help prevent leaving a route with unsaved changes

## `FormCreateMixin`

### Usage

The `FormCreateMixin` handles creating the reactive data and flags from the field keys and initial values. The form name/key and fields (with intial values) can be specified when adding the mixin to the component.

```js
import { FormCreateMixin } from "@kendallroth/vue-simple-forms";

const fields = { email: "test@example.com", password: "********" };

const vm = new Vue({
  mixins: [FormCreateMixin("testForm", fields, { calculateChanged: false })],
});

// Indicate loading
vm.data.testForm.setLoading(true);
// Indicate submitting
vm.data.testForm.setSubmitting(true);
```

> **NOTE:** The `createForm` function is an alternative to the `FormCreateMixin` (which is preferred).

```js
// Alternative approach
import { createForm } from "@kendallroth/vue-simple-forms";

const fields = { email: "", password: "" };

const vm = new Vue({
  data() {
    ...createForm("testForm", fields, { calculateChanged: false }),
  },
});
```

### API

### Config

Both `FormCreateMixin` and `createForm` accept several arguments to configure the form.

| Property                   | Type      | Default | Description                                            |
| -------------------------- | --------- | ------- | ------------------------------------------------------ |
| `name`                     | `string`  |         | Form `data` key name                                   |
| `fields`                   | `Object`  |         | Form fields and initial values                         |
| `options`                  | `Object`  |         | Form configuration options                             |
| `options.calculateChanged` | `boolean` | `true`  | Whether `changed` flag is calculated (performance)     |
| `options.flags`            | `Object`  | `{}`    | Custom flags and initial values (set with `setFlag()`) |

#### Mixin Data

The `form` object (name specified by mixin options) provides a simple API, particularly the field values and form flags. There are several additional utility methods to control the flags.

| Property                               | Description                                            |
| -------------------------------------- | ------------------------------------------------------ |
| `_initial`                             | _Initial field values_                                 |
| `flags`                                | Form state flags                                       |
| `fields`                               | Form field values                                      |
| `getValues()`                          | Get form values                                        |
| `setFlag(flag, value)`                 | Set a form flag (**only use for custom `flags`!**)     |
| `setLoading(isLoading)`                | Set the loading flag                                   |
| `setSubmitting(isSubmitting)`          | Set the submitting flag                                |
| `setValues(values, setInitial = true)` | Set the form values (optionally update initial values) |
| `reset()`                              | Reset the form to initial values                       |

> **NOTE:** Included form `flags` are handled internally and should not be modified with `setFlags()` method!

#### Form Flags

The form flags are computed from the form state and should not be modified directly; instead, use their corresponding utility methods.

| Property     | Description                                                       | Method            |
| ------------ | ----------------------------------------------------------------- | ----------------- |
| `changed`    | Whether form has changed (comparison of values to initial values) |                   |
| `disabled`   | Whether form is disabled (either submitting or loading)           |                   |
| `loading`    | Whether form is loading                                           | `setLoading()`    |
| `submitting` | Whether form is submitting                                        | `setSubmitting()` |

## `FormLeaveGuardMixin`

### Usage

The `FormLeaveGuardMixin` provides helpers to prevent leaving a form (managed by `FormCreateMixin`) with unsaved data. These helpers can be utilized by the component to allow the user to handle the route change or cancellation based on the provided properties. The mixin checks the `changed` flag of a form (or forms) created by the `FormCreateMixin`.

```js
import { FormLeaveGuardMixin } from "@kendallroth/vue-simple-forms";

const vm = new Vue({
  mixins: [
    FormLeaveGuardMixin("testForm", {
      activeKey: "isLeavingForm",
      callbackKey: "formLeaveCallback",
      onlyPrevent: false, // Would render "activeKey" useless
      // onPrevent: (callback) => Vuex.commit("SHOW_ROUTE_LEAVE", { callback })
    }),
  ],
  // mixins: [FormLeaveGuardMixin(["testForm", "anotherForm")],
  template: `
    <template>
      <ConfirmDialog
        v-if="isLeavingForm"
        @confirm="formLeaveCallback(true)"
        @cancel="formLeaveCallback(false)"
      />
    </template>
  `,
});
```

### API

### Config

`FormLeaveGuardMixin` accepts several arguments to configure the form.

| Property                      | Type              | Default             | Description                                                   |
| ----------------------------- | ----------------- | ------------------- | ------------------------------------------------------------- |
| `formNames`                   | `string|string[]` |                     | Form `data` key name                                          |
| `options`                     | `Object`          | `{}`                | Form configuration options                                    |
| `options.activeKey`           | `string`          | `isLeaveFormActive` | Key name to indicate when form leave guard is active          |
| `options.callbackKey`         | `string`          | `formLeaveCallback` | Key name for route leave confirmation callback                |
| `options.onlyPrevent`         | `boolean`         | `false`             | Whether to only prevent leaving form ("activeKey" is useless) |
| `options.onPrevent(callback)` | `function`        | `() => {}`          | Custom prevention handler (ie. for handling with Vuex, etc)   |

### Mixin Data

The `FormLeaveGuardMixin` provides a computed property to control a confirmation dialog (or other form) and a callback to handle leaving or remaining at the form.

| Property                           | Description                                        |
| ---------------------------------- | -------------------------------------------------- |
| `isLeaveFormActive`\*              | Whether the leave route protection is active/shown |
| `formLeaveCallback(shouldLeave)`\* | Confirmation callback (from dialog, etc)           |

> **NOTE:** Since these API names can be configured, use the appropriate names from the mixin constructor.

## Development

Plugin development can be aided by installing this package locally (through file path) in another project.

```sh
cd project-with-dependency

# Relative path depends on location from "depending" project
npm install ../vue-simple-forms
```

This project can be started and will automatically rebuild on file changes:

```sh
npm run build:dev
```

## Miscellaneous

> Project boilerplate from: [`flexdinesh/npm-module-boilerplate`](https://github.com/flexdinesh/npm-module-boilerplate)
