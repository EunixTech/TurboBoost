const { JSDOM } = require('jsdom');

module.exports = (htmlContent) => {

  const dom = new JSDOM(htmlContent);
  const imgTag = dom.window.document.querySelector('img');

  imgTag.removeAttribute('data-sizes');
  imgTag.removeAttribute('data-widths');

  return dom.serialize();
  
}

