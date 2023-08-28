/**
  * Replaces link tags in the provided HTML with modified link tags.
  *
  * @param {string} html - The HTML string to modify.
  * @returns {string} The modified HTML string.
*/
module.exports = (htmlContent) => {

    const linkTagRegex = /<link.*?>/g;
    const withLinkTagsReplaced = htmlContent.replace(linkTagRegex, match => {
        const hrefMatches = match.trim().match(/<link\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/);
        
        if (hrefMatches && hrefMatches.length === 3) {
            const assetUrl = hrefMatches[2];
            return `<link rel="stylesheet" href="${assetUrl}" as="style" media="none" onload="this.onload=null;this.media='all'">`;
        }
        return match;
    });
 
    return withLinkTagsReplaced;
}
