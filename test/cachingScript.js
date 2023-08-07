function applyChangesToHTML(html) {
    // Versioned CSS with Cache-Control
    html = html.replace(/<link rel="stylesheet" href="(.*?\.css)">/g, (match, url) => {
      const versionedUrl = `${url}?v=${Math.floor(Date.now() / 1000)}`;
      return `<link rel="stylesheet" href="${versionedUrl}" media="all">`;
    });
  
    // Optimize image with dynamic version timestamp
    html = html.replace(/<img src="(.*?)" alt="(.*?)">/g, (match, url, alt) => {
      const productUpdatedAt = Math.floor(Date.now() / 1000);
      const optimizedImageUrl = `${url}?v=${productUpdatedAt}`;
      return `<img src="${optimizedImageUrl}" alt="${alt}">`;
    });
  
    return html;
  }


  
  // eslint-disable-next-line no-unused-vars
  function refreshDynamicImages(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    var dynamicImages = doc.querySelectorAll('img.dynamic-image');
  
    dynamicImages.forEach(function(img) {
      var imageUrl = img.getAttribute('src');
      var updatedAt = img.getAttribute('data-updated-at');
      var optimizedImageUrl = imageUrl + '?v=' + updatedAt;
  
      img.setAttribute('src', optimizedImageUrl);
    });
  
    return doc.documentElement.outerHTML;
  }
  
  // Sample HTML content
  const sampleHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <link rel="stylesheet" href="styles.css">
    </head>
    <body>
      <img src="product.jpg" alt="Sample Product">
    </body>
    </html>
  `;
  
  // Apply changes to the sample HTML
  const modifiedHTML = applyChangesToHTML(sampleHTML);
  console.log(modifiedHTML);
  