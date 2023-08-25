/**
 * Delays the loading of Google Fonts by modifying the HTML content.
 * 
 * @param {string} htmlContent - The HTML content to be modified.
 * @returns {Object} An object containing a boolean indicating whether the HTML was modified and the modified HTML content.
 */
const DelayGoogleFontLoading = (htmlContent) => {

    const fontPattern = /https:\/\/fonts\.googleapis\.com\/css2\?[^"]+/g,
        fontLinks = htmlContent.match(fontPattern);
  
    if (fontLinks) {

        let modifiedHtml = htmlContent;

        fontLinks.forEach(link => {
            if (!/display=swap/.test(link)) {
                const modifiedLink = link.replace(/(\?[^"]+)/, '$1&display=swap');
                modifiedHtml = modifiedHtml.replace(link, modifiedLink);
            } 
        });

        return {
            isModified: true,
            modifiedHtml
        }

    } else { return {isModified: false}; }

};

module.exports = DelayGoogleFontLoading;

