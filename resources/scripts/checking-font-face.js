const CheckFontFaceExists = async (cssAssetsURL) => {
  
  try {
    const res = await fetch(cssAssetsURL);
    const cssContent = await res.text();

    const fontFaceRegex = /@font-face\s*\{[\s\S]*?\}/g;
    const fontFaceMatches = cssContent.match(fontFaceRegex);

    return { fontExists: fontFaceMatches && fontFaceMatches.length > 0, cssContent };
  } catch (error) {
    console.error("Error fetching CSS:", error);
    return { fontExists: false, cssContent: null };
  }
};


module.exports = CheckFontFaceExists;
