const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

module.exports = function () {
    const filePath = path.join(__dirname, "../content/education.md");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data } = matter(fileContent);
    return data.education || [];
};
