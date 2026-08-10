import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import pluginRss from "@11ty/eleventy-plugin-rss";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy("./src/js");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");
  eleventyConfig.addWatchTarget("./src/css/style.css");
  eleventyConfig.addWatchTarget("./src/css/prism-one-light.css");
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addCollection("post", (collectionApi) =>
    collectionApi.getFilteredByTag("post").sort((a, b) => b.date - a.date),
  );
  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tagSet = new Set();
    collectionApi.getFilteredByTag("post").forEach((post) => {
      (post.data.tags || []).forEach((tag) => {
        if (tag !== "post") tagSet.add(tag);
      });
    });
    return [...tagSet].sort();
  });
  eleventyConfig.addFilter("displayTags", (tags) => (tags || []).filter((tag) => tag !== "post"));
  eleventyConfig.addFilter("readingTime", (content) => {
    if (!content) return 1;
    const words = String(content)
      .replace(/<[^>]*>/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  });
  return {
    dir: { input: "src", output: "_site" },
  };
}
