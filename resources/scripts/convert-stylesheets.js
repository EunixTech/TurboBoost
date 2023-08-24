/**
 * @param {string} html - The HTML string to convert.
 * @returns {string} The converted HTML string.
 */
const convertStylesheets = (htmlContent) => {

    // Find and replace stylesheet_tag occurrences
    const modifiedHtmlContent = htmlContent.replace(/\{\{\s*(['"])([\w.-]+)\s*\|\s*asset_url\s*\1\s*\|\s*stylesheet_tag\s*\}\}/g,
        '<link rel="stylesheet" href="{{ $2 | asset_url }}" />');

    // Convert remaining <link> elements
    const parser = new DOMParser(),
        doc = parser.parseFromString(modifiedHtmlContent, 'text/html'),
        links = doc.querySelectorAll('link[rel="stylesheet"]');

    links.forEach((link) => {
        const href = link.getAttribute('href');

        if (href && href.includes('{{') && href.includes('| asset_url }}')) {
            link.setAttribute('href', `{{ ${href} }}`);
        }
    });

    return doc.documentElement.outerHTML;
}

module.exports = convertStylesheets;
