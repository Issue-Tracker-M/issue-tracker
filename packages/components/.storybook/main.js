const path = require("path");
const { DllReferencePlugin } = require("webpack");

const toPath = (_path) => {
  // throw new Error(process.env.PWD + " " + process.cwd());
  return path.join(process.cwd(), _path);
};
const emotionPath = toPath("../../../node_modules/@emotion/react");

// make a shallow copy of an object, rejecting keys that match /emotion/
function emotionless(object, predicate) {
  let result = {};
  for (key in object) {
    if (!/emotion/.test(key)) {
      result[key] = object[key];
    }
  }
  return result;
}

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: emotionless(config.resolve.alias),
        // alias: {
        //   ...config.resolve.alias,
        //   "@emotion/core": toPath("../../../node_modules/@emotion/react"),
        //   "emotion-theming": toPath("../../../node_modules/@emotion/react"),
        //   // "@emotion/core": emotionPath,
        //   // "emotion-theming": emotionPath,
        // },
      },
      plugins: config.plugins.map((plugin) => {
        // clone the config of the DllReferencePlugin and remove references to emotion libs
        if (plugin instanceof DllReferencePlugin) {
          const { name, content } = require(plugin.options.manifest);
          return new DllReferencePlugin({
            context: plugin.options.context,
            name,
            content: emotionless(content),
          });
        } else {
          return plugin;
        }
      }),
    };
  },
};
