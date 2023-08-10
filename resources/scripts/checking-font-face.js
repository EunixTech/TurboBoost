const checkFontFaceExists = (cssAssetsURL) =>{

  fetch(cssAssetsURL)
    .then((res) => res.text())
    .then((cssContent) => {

      const fontFaceRegex = /@font-face\s*\{[\s\S]*?\}/g,
        fontFaceMatches = cssContent.match(fontFaceRegex);

      if (fontFaceMatches && fontFaceMatches.length > 0) {
        // callback(true, fontFaceMatches);
        return true
      } else {
        return false
      }

    })
    .catch((error) => {
      console.error("Error fetching CSS:", error);
      return false
    });

}

module.exports = checkFontFaceExists;
