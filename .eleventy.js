const { EleventyRenderPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Pass-through copies
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/content/images");
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  // Collections
  eleventyConfig.addCollection("updates", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/content/updates/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("experience", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/content/experience/*.md")
      .sort((a, b) => {
        const dateA = new Date(a.data.start_date || 0);
        const dateB = new Date(b.data.start_date || 0);
        return dateB - dateA;
      });
  });

  eleventyConfig.addCollection("publications", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/content/publications/*.md")
      .sort((a, b) => (b.data.year || 0) - (a.data.year || 0));
  });

  eleventyConfig.addCollection("presentations", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/content/presentations/*.md")
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  eleventyConfig.addCollection("awards", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/content/awards/*.md")
      .sort((a, b) => (b.data.year || 0) - (a.data.year || 0));
  });

  eleventyConfig.addCollection("gallery", function (collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/gallery/*.md");
  });

  // Filters
  eleventyConfig.addFilter("dateDisplay", function (date) {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  });

  eleventyConfig.addFilter("limit", function (arr, limit) {
    if (!Array.isArray(arr)) return arr;
    return arr.slice(0, limit);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
