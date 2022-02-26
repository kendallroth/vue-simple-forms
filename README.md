# Vue Forms

![](https://github.com/kendallroth/vue-simple-forms/workflows/Jest%20Test/badge.svg)

Simple Vue form state management library (no validation, etc).

> **NOTE:** With the release of Vue 3 and libraries like [VeeValidate](https://vee-validate.logaretm.com/v4/guide/overview), this library will no longer be maintained (2022-02-26).

- [`createForm`](#createform)
- [~~`FormCreateMixin`~~](#deprecated-formcreatemixin) (_deprecated_)
- [`FormGuardMixin`](#formguardmixin)
- [~~`FormLeaveGuardMixin`~~](#deprecated-formleaveguardmixin) (_deprecated_)

```sh
npm install @kendallroth/vue-simple-forms --save
```

## Features

- Create reactive Vue data for forms
- Track basic form fields
- Help prevent leaving a route with unsaved changes

## `createForm`

> **NOTE:** The previous `FormCreateMixin` has been removed as it did not support TypeScript!

### Usage

The `createForm` function handles creating the reactive data and flags from the field keys and initial values. The form name/key and fields (with intial values) can be specified when adding the data to the component.

```js
import { createForm } from "@kendallroth/vue-simple-forms";

const fields = { email: "", password: "" };

const vm = new Vue({
  data() {
    testForm: createForm(fields, { calculateChanged: false }),
  },
});

// Indicate loading
vm.data.testForm.setLoading(true);
// Indicate submitting
vm.data.testForm.setSubmitting(true);
```

Alternatively, TypeScript users will benefit from `vue-property-decorator` integration:

```js
import { createForm } from "@kendallroth/vue-simple-forms";
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Form extends Vue {
  testForm = createForm({ ... });

  mounted() {
    this.testForm.setValues({ ... });
  }
}

```

### API

### Config

`createForm` accepts several arguments to configure the form.

| Property                   | Type      | Default | Description                                            |
| -------------------------- | --------- | ------- | ------------------------------------------------------ |
| `fields`                   | `Object`  |         | Form fields and initial values                         |
| `options`                  | `Object`  |         | Form configuration options                             |
| `options.calculateChanged` | `boolean` | `true`  | Whether `changed` flag is calculated (performance)     |
| `options.flags`            | `Object`  | `{}`    | Custom flags and initial values (set with `setFlag()`) |

#### Mixin Data

The `form` object (name specified by mixin options) provides a simple API, particularly the field values and form flags. There are several additional utility methods to control the flags.

| Property                                | Description                                            |
| --------------------------------------- | ------------------------------------------------------ |
| `_initial`                              | _Initial field values_                                 |
| `flags`                                 | Form state flags                                       |
| `fields`                                | Form field values                                      |
| `getValues()`                           | Get form values                                        |
| `setFlag(flag, value)`                  | Set a form flag (**only use for custom `flags`!**)     |
| `setInitial(values)`                    | Set the initial form values                            |
| `setLoading(isLoading)`                 | Set the loading flag                                   |
| `setSubmitting(isSubmitting)`           | Set the submitting flag                                |
| `setValues(values, setInitial = false)` | Set the form values (update initial values by default) |
| `reset()`                               | Reset the form to initial values                       |

> **NOTE:** Included form `flags` are handled internally and should not be modified with `setFlags()` method!

#### Form Flags

The form flags are computed from the form state and should not be modified directly; instead, use their corresponding utility methods.

| Property     | Description                                                       | Method            |
| ------------ | ----------------------------------------------------------------- | ----------------- |
| `changed`    | Whether form has changed (comparison of values to initial values) |                   |
| `disabled`   | Whether form is disabled (either submitting or loading)           |                   |
| `loading`    | Whether form is loading                                           | `setLoading()`    |
| `submitting` | Whether form is submitting                                        | `setSubmitting()` |

## [DEPRECATED] `FormCreateMixin`

> **NOTE:** This has been deprecated in favour of the fully typed `createForm`.

## `FormGuardMixin`

### Usage

The `FormGuardMixin` provides helpers to prevent leaving a form (managed by `createForm`) with unsaved data. These helpers can be utilized by the component to allow the user to handle the route change or cancellation based on the provided properties. The mixin checks the `changed` flag of a form (or forms) created by the `createForm`.

```js
import { createForm, FormGuardMixin } from "@kendallroth/vue-simple-forms";

const vm = new Vue({
  data() {
    sampleForm: createForm(...),
    formGuards: [this.sampleForm],
  },
  mixins: [FormLeaveGuardMixin],
  template: `
    <template>
      <ConfirmDialog
        v-if="isFormGuardActive"
        text="Are you sure? There are unsaved changes!"
        @confirm="onFormLeave(true)"
        @cancel="onFormLeave(false)"
      />
    </template>
  `,
});
```

Alternatively, TypeScript users will benefit from `vue-property-decorator` integration:

```js
import { createForm, FormGuardMixin } from "@kendallroth/vue-simple-forms";
import { Component, Mixins } from "vue-property-decorator";

@Component({
  template: `
    <template>
      <ConfirmDialog
        v-if="isFormGuardActive"
        text="Are you sure? There are unsaved changes!"
        @confirm="onFormLeave(true)"
        @cancel="onFormLeave(false)"
      />
    </template>
  `,
})
export default class Form extends Mixins(FormGuardMixin) {
  testForm = createForm({ ... });
  formGards = [this.testForm]

  mounted() {
    this.testForm.setValues({ ... });
  }
}

```

### API

### Config

`FormGuardMixin` accepts a configuration `data` variable.

| Property     | Type     | Description                          |
| ------------ | -------- | ------------------------------------ |
| `formGuards` | `Form[]` | Form objects created by `createForm` |

### Mixin Data

The `FormGuardMixin` provides a computed property to control a confirmation dialog (or other form) and a callback to handle leaving or remaining at the form.

| Property                   | Description                                        |
| -------------------------- | -------------------------------------------------- |
| `isFormGuardActive`        | Whether the leave route protection is active/shown |
| `onFormLeave(shouldLeave)` | Confirmation callback (from dialog, etc)           |

## [DEPRECATED] `FormLeaveGuardMixin`

> **NOTE:** This has been deprecated in favour of the fully typed `FormGuardMixin`.

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

See [this link](https://www.typescriptlang.org/docs/handbook/babel-with-typescript.html) for information on using TypeScript with Babel. In summary, TypeScript is used for type checking but Babel is used for transpilation!

> **NOTE:** Coverage tests are currently broken after the switch to TypeScript, and some had to be disabled!

## Miscellaneous

> Project boilerplate from: [`flexdinesh/npm-module-boilerplate`](https://github.com/flexdinesh/npm-module-boilerplate)
