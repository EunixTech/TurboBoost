/**
 * Function to add 'font-display: swap;' in @font-face of CSS content if it doesn't exist already.
 * @param {string} cssContent - The CSS content.
 * @returns {string} - The updated CSS content.
 */
const addingFontDisplayInCss = (cssContent) => {

    const fontFaceRegex = /@font-face\s*\{[\s\S]*?\}/g,
        fontFaceMatches = cssContent.match(fontFaceRegex);

    if (fontFaceMatches && fontFaceMatches.length > 0) {

        const updatedCss = cssContent.replace(fontFaceRegex, (match) => {
            if (match.includes("font-display")) return match;
            return match.replace("}", "font-display: swap;}");
        });

        return updatedCss;
    }

  return cssContent;
};

module.exports = addingFontDisplayInCss;

