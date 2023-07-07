/**
 * Function minify whole page content which includes html css and javascript code
 * Function take html (page content as argument) and return minified content
 */

const minify = require("html-minifier").minify;

function minifyPageContent(pageContent) {

    const minifiedHTML = minify(pageContent, {
        collapseWhitespace: true, // Remove white spaces
        removeComments: true, // Remove HTML comments
        minifyCSS: true, // Minify CSS within <style> tags
        minifyJS: true, // Minify JavaScript within <script> tags
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeAttributeQuotes: true, // Remove unnecessary quotes from attributes
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
    });

    return minifiedHTML;
}

module.exports = minifyPageContent;
