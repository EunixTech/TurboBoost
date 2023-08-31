const { JSDOM } = require('jsdom');

function removeAttributesFromImgTag(html) {
  const dom = new JSDOM(html);
  const imgTag = dom.window.document.querySelector('img');

  imgTag.removeAttribute('data-sizes');
  imgTag.removeAttribute('data-widths');

  return dom.serialize();
}

const htmlString = '<img id="Image-123" class="responsive-image__image lazyload" src="image.jpg" data-src="image.jpg" data-widths="[180,360,540]" data-aspectratio="1.5" data-sizes="auto" tabindex="-1" alt="Image">';
const modifiedHtmlString = removeAttributesFromImgTag(htmlString);
console.log(modifiedHtmlString);