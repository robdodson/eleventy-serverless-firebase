const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
    name: "possum", // The serverless function name from your permalink object
    functionsDir: "./functions/",
  });

  // You can return your Config object (optional).
  return {
    dir: {
      input: "./src",
    },
  };
};
