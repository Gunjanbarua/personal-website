const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

module.exports = function () {
    const filePath = path.join(__dirname, "../content/experience.md");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);
    // Sort most recent first by start_date
    const list = data.experience || [];
    list.sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0));
    return list;
};
