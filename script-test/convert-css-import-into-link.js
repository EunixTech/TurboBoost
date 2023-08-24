const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const convertStylesheets = (htmlContent) => {

  // Find and replace stylesheet_tag occurrences, excluding 'critical' stylesheets
  const modifiedHtmlContent = htmlContent.replace(/{{ '(?!.*critical.*)([^']+)' \| asset_url \| stylesheet_tag }}/g,'<link rel="stylesheet" href="{{ $1 | asset_url }}" defer />');
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
// Example usage
const inputHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Example Page</title>
    {{ 'icon-font.min.css' | asset_url | stylesheet_tag }}
    {{ 'style.css' | asset_url | stylesheet_tag }}
    {{ 'animate.css' | asset_url | stylesheet_tag }}
    {{ 'hamburgers.min.css' | asset_url | stylesheet_tag }}
    {{ 'animsition.min.css' | asset_url | stylesheet_tag }}
    {{ 'select2.min.css' | asset_url | stylesheet_tag }}
    {{ 'daterangepicker.css' | asset_url | stylesheet_tag }}
    {{ 'slick.css' | asset_url | stylesheet_tag }}
    {{ 'lightbox.min.css' | asset_url | stylesheet_tag }}
    {{ 'util.css' | asset_url | stylesheet_tag }}
    {{ 'main-critical.css' | asset_url | stylesheet_tag }}
    {{ 'quickview.css' | asset_url | stylesheet_tag }}
    {{ 'magnific-popup.css' | asset_url | stylesheet_tag }}
  </head>
  <body>
    <h1>Hello, World!</h1>
  </body>
  </html>
`;

const updatedHtml = convertStylesheets(inputHtml);
console.log(updatedHtml);

