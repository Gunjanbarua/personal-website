const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

module.exports = function () {
    const filePath = path.join(__dirname, "../content/presentations.md");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);
    // Sort by date descending
    const list = data.presentations || [];
    list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    return list;
};
