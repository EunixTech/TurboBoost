// const CheckFontFaceExists = (cssAssetsURL, callback) => {
 
//   fetch(cssAssetsURL)
//     .then((res) => res.text())
//     .then((cssContent) => {
  
//       const fontFaceRegex = /@font-face\s*\{[\s\S]*?\}/g,
//         fontFaceMatches = cssContent.match(fontFaceRegex);

//       if (fontFaceMatches && fontFaceMatches.length > 0) {
      
//         return callback(true, cssContent);
//       } else {
//         return callback(false);
//       }
//     })
//     .catch((error) => {
//       console.error("Error fetching CSS:", error);
//       return callback(false);
//     });

// };

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
