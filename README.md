# Vue Forms

Simple Vue form state management library (no validation, etc).

## Features

- Create reactive Vue data for forms
- Track basic form fields

## Usage

The `createForm` function handles creating the reactive data and flags from the field keys and initial values.

```js
import { createForm } from "@kendallroth/vue-simple-forms";

const vm = new Vue({
  data() {
    ...createForm("form", {
      email: "",
      password: ""
    }),
  },
})
```

```js
vm.data == {
  form: {
    fields: {
      email: "",
      password: "",
    },
    flags: {
      changed: false,
      disabled: false,
      loading: false,
      submitting: false,
    },
    getValues(),
    setLoading(),
    setSubmitting(),
    setValues(),
    reset(),
  }
}
```

## API

#### Form

| Property | Description |
|----------|-------------|
| `_initial` | _Initial field values_
| `flags` | Form state flags
| `fields` | Form field values
| `getValues()` | Get form values
| `setFlag(flag, value)` | _Set a form flag_
| `setLoading(isLoading)` | Set the loading flag
| `setSubmitting(isSubmitting)` | Set the submitting flag
| `setValues(values, setInitial = true)` | Set the form values
| `reset()` | Reset the form to initial values

#### Form Flags

| Property | Description |
|----------|-------------|
| `changed` | Whether form has changed (comparison of values to initial values)
| `disabled` | Whether form is disabled (either submitting or loading)
| `loading` | Whether form is loading
| `submitting` | Whether form is submitting

> Project boilerplate from: [`flexdinesh/npm-module-boilerplate`](https://github.com/flexdinesh/npm-module-boilerplate)
