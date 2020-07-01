module.exports = {
  parser: "babel-eslint",
  extends: "eslint:recommended",
  env: {
    jest: true,
    node: true,
  },
  rules: {
    "comma-dangle": ["warn", "always-multiline"],
    "no-tabs": "warn",
    "no-trailing-spaces": "warn",
    "no-unused-vars": "error",
    "no-unreachable": "error",
    "prefer-const": "warn",
    "prefer-destructuring": "warn",
    quotes: ["warn", "double"],
    semi: ["warn", "always"],
  },
};
