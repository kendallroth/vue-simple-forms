module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  plugins: ["@typescript-eslint"],
  env: {
    jest: true,
    node: true,
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "no-console": "warn",
    "no-tabs": "warn",
    "no-trailing-spaces": "warn",
    "no-unused-vars": "warn",
    "no-unreachable": "error",
    "prefer-const": "warn",
    "prefer-destructuring": "warn",
  },
};
