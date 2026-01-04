import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addWatchTarget("./src/css/style.css");
  eleventyConfig.addWatchTarget("./src/css/prism-one-light.css");
  eleventyConfig.addPlugin(syntaxHighlight);
  return {
    dir: { input: "src", output: "_site" },
  };
}
