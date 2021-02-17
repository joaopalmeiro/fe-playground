module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter("svgContents", require("./filters/svgContents.js"));

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
