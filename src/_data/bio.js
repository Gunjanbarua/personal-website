const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

module.exports = function () {
    const filePath = path.join(__dirname, "../content/bio.md");
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContent);
    // Replace body text into the bio field so templates use bio.bio
    data.bio = data.bio || content.trim();
    return data;
};
