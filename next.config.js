const withPlugins = require("next-compose-plugins");
const transpileModules = require("next-transpile-modules")([
  "three",
  "drei",
  "postprocessing",
  "react-three-fiber",
]);

module.exports = withPlugins([transpileModules]);
