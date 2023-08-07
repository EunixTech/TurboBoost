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
  