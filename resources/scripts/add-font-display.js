const AddingFontDisplayInCss = (cssContent) => {

    console.log(`cssContentcssContentcssContent`,cssContent)

    const fontFaceRegex = /@font-face\s*\{[\s\S]*?\}/g,
        fontFaceMatches = cssContent.match(fontFaceRegex);

    if (fontFaceMatches && fontFaceMatches.length > 0) {

        const updatedCss = cssContent.replace(fontFaceRegex, (match) => {

            // Check if font-display property already exists
            if (match.includes("font-display"))return match;

            // Add font-display property
            return match.replace("}", "font-display: swap;}");

        });

        return updatedCss;
    }

  return cssContent;

};

module.exports = AddingFontDisplayInCss;
