const CheckFontFaceExists = (cssAssetsURL, callback) => {
 
  fetch(cssAssetsURL)
    .then((res) => res.text())
    .then((cssContent) => {
      const fontFaceRegex = /@font-face\s*\{[\s\S]*?\}/g,
        fontFaceMatches = cssContent.match(fontFaceRegex);

      if (fontFaceMatches && fontFaceMatches.length > 0) {
        console.log(`fontFaceMatches`, fontFaceMatches.length);
        return callback(true);
      } else {
        return callback(false);
      }
    })
    .catch((error) => {
      console.error("Error fetching CSS:", error);
      return callback(false);
    });

};

module.exports = CheckFontFaceExists;
