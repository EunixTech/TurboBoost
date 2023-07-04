const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function addAriaLabelToAnchors(htmlString) {
  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  const anchors = document.getElementsByTagName('a');

  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i];
    anchor.setAttribute('aria-label', 'Link');
  }

  return dom.serialize();
}

// Example usage
const html = '<div><a href="https://example.com">Link 1</a><a href="https://example.com">Link 2</a></div>';
const modifiedHtml = addAriaLabelToAnchors(html);
console.log(modifiedHtml);
