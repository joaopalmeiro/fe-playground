const fs = require("fs");
const path = require("path");

module.exports = function (file) {
  // Syntax: `{{ "/string/to/svg.svg" | svgContents | safe }}`.

  if (path.extname(file) !== ".svg") {
    throw new Error(`${file} must be an SVG file.`);
  }

  let relativeFilePath = `.${file}`;

  let data = fs.readFileSync(relativeFilePath, function (err, contents) {
    if (err) {
      throw new Error(err);
    }

    return contents;
  });

  return data.toString("utf8");
};
