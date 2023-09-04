function AssetsCaching(htmlContent, cacheDuration) {
  
    // Versioned CSS with Cache-Control
    htmlContent = htmlContent.replace(/<link rel="stylesheet" href="(.*?\.css)">/g, (match, url) => {
      const versionedUrl = `${url}?v=${Math.floor(Date.now() / 1000)}`;
      return `<link rel="stylesheet" href="${versionedUrl}" media="all">`;
    });
  
    // Optimize images with dynamic version timestamp
    htmlContent = htmlContent.replace(/<img src="(.*?)" alt="(.*?)">/g, (match, url, alt) => {
      const productUpdatedAt = Math.floor(Date.now() / 1000);
      const optimizedImageUrl = `${url}?v=${productUpdatedAt}`;
      return `<img src="${optimizedImageUrl}" alt="${alt}" class="dynamic-image" data-updated-at="${productUpdatedAt}">`;
    });
  
    // Refresh dynamic images using DOM manipulation
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlContent, 'text/html');
    var dynamicImages = doc.querySelectorAll('img.dynamic-image');
    
    dynamicImages.forEach(function(img) {
      var imageUrl = img.getAttribute('src');
      var updatedAt = img.getAttribute('data-updated-at');
      var optimizedImageUrl = imageUrl + '?v=' + updatedAt;
    
      img.setAttribute('src', optimizedImageUrl);
    });
  
    // Apply aggressive caching with versioned URLs
    var version = new Date().getTime();
    var assetPattern = /(<link[^>]+href="[^"]+\.(?:css|js)[^"]*"[^>]*>)/gi;
    var versionedHTML = htmlContent.replace(assetPattern, function(match, p1) {
      return p1.replace(/(href="[^"]+\.(css|js)[^"]*")/, '$1?v=' + version);
    });
  
    // Set Cache-Control for the modified HTML content
    const modifiedResponse = new Response(versionedHTML, {
      headers: { 'Cache-Control': `max-age=${cacheDuration}` }
    });
  
    // Return the modified HTML content as a promise
    return modifiedResponse.text();
  }
  
  module.exports = AssetsCaching