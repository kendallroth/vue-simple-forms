module.exports = {
  "parser": "babel-eslint",
  "extends": "eslint:recommended",
  "env": {
    "mocha": true
  },
  "rules": {
    "comma-dangle": ["warn", "always-multiline"],
    "no-unused-vars": "warn",
    "no-tabs": "warn",
    "no-trailing-spaces": "warn",
    "no-unreachable": "error",
    "no-unused-vars": "error",
    "prefer-const": "warn",
    "prefer-destructuring": "warn",
    "quotes": ["warn", "double"],
    "semi": ["warn", "always"]
  }
}
