const withPlugins = require("next-compose-plugins");
const transpileModules = require("next-transpile-modules")([
  "three",
  "drei",
  "postprocessing",
]);

module.exports = withPlugins([transpileModules]);
