const { JSDOM } = require('jsdom');

function replaceImgWithTag(htmlString) {
  const dom = new JSDOM(htmlString);
  const tempElement = dom.window.document.createElement('div');
  tempElement.innerHTML = htmlString;

  const imgTags = tempElement.getElementsByTagName('img');

  for (let i = imgTags.length - 1; i >= 0; i--) {
    const imgTag = imgTags[i];
    const replacementText = dom.window.document.createTextNode('manmohan');
    imgTag.parentNode.replaceChild(replacementText, imgTag);
  }

  return tempElement.innerHTML;
}

// Example usage:
const htmlString = '<div><img src="example.jpg" alt="Example Image"><p>This is an <img src="another.jpg" alt="Another Image"></p></div>';
const updatedHTML = replaceImgWithTag(htmlString);
console.log(updatedHTML);
