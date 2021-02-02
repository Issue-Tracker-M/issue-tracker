const path = require("path");
const toPath = (_path) => {
  return path.join(process.cwd(), _path);
};
const emotionPath = toPath("../../../node_modules/@emotion/react");
module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          // "@emotion/core": toPath("../../../node_modules/@emotion/react"),
          // "emotion-theming": toPath("../../../node_modules/@emotion/react"),
          "@emotion/core": emotionPath,
          "emotion-theming": emotionPath,
        },
      },
    };
  },
};
