const jsdom = require("jsdom"),
{ JSDOM } = jsdom;
/**
 * @param {string} html - The HTML string to convert.
 * @returns {string} The converted HTML string.
 */
const convertStylesheets = (htmlContent) => {

    // Find and replace stylesheet_tag occurrences
    const modifiedHtmlContent = htmlContent.replace(/{{ '([^']+)' \| asset_url \| stylesheet_tag }}/g,'<link rel="stylesheet" href="{{ $1 | asset_url }}" defer />');
    // Convert remaining <link> elements
        const dom = new JSDOM(modifiedHtmlContent),
        links = dom.window.document.querySelectorAll('link[rel="stylesheet"]');

        links.forEach((link) => {
            const href = link.getAttribute('href');
      
            if (href && href.includes('{{') && href.includes('| asset_url }}') && !href.includes('critical')) {
              link.setAttribute('href', `{{ ${href} }}`);
              link.setAttribute('defer', 'defer');
          }
        });

    return dom.window.document.documentElement.outerHTML;
}

module.exports = convertStylesheets;

