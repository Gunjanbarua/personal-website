const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

module.exports = function () {
    const filePath = path.join(__dirname, "../content/awards.md");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);
    // Sort by year descending
    const list = data.awards || [];
    list.sort((a, b) => (b.year || 0) - (a.year || 0));
    return list;
};
