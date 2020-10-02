const { BABEL_ENV } = process.env;

const isProduction = BABEL_ENV === "production";

module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/typescript",
    isProduction && "minify",
  ].filter(Boolean),
  plugins: [
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    "@babel/proposal-object-rest-spread",
  ],
};
