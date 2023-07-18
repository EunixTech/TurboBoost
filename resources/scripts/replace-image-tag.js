const { JSDOM } = require("jsdom");

function ReplaceImagTag(htmlString) {
    const dom = new JSDOM(htmlString);
    const tempElement = dom.window.document.createElement("div");
    tempElement.innerHTML = htmlString;

    const imgTags = tempElement.getElementsByTagName("img");

    for (let i = imgTags.length - 1; i >= 0; i--) {
        const imgTag = imgTags[i];
        const replacementText = dom.window.document.createTextNode(`{% include 'responsive-product-image',
        image: product.featured_image %}`);
        imgTag.parentNode.replaceChild(replacementText, imgTag);
  }

  return tempElement.innerHTML;
}

module.exports =  ReplaceImagTag
