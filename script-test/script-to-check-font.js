function checkCssForFontFace(cssUrl, callback) {
    fetch(cssUrl)
      .then(response => response.text())
      .then(cssContent => {
        const fontFaceRegex = /@font-face\s*\{[\s\S]*?\}/g;
        const fontFaceMatches = cssContent.match(fontFaceRegex);
  
        if (fontFaceMatches && fontFaceMatches.length > 0) {
          callback(true, fontFaceMatches);
        } else {
          callback(false);
        }
      })
      .catch(error => {
        console.error('Error fetching CSS:', error);
        callback(false);
      });
  }
  
  // Usage
  const cssUrl = 'https://cdn.shopify.com/s/files/1/0780/8001/6664/t/12/assets/main.css?v=1691603769';
  checkCssForFontFace(cssUrl, (containsFontFace, fontFaceMatches) => {
    if (containsFontFace) {
      console.log('CSS file contains @font-face rules:');
      fontFaceMatches.forEach((match, index) => {
        console.log(`Rule ${index + 1}:`);
        console.log(match);
      });
    } else {
      console.log('CSS file does not contain @font-face rules.');
    }
  });
  