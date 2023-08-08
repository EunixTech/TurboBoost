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


  
  //eslint-disable-next-line no-unused-vars
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
  
 
  function applyAggressiveCaching(html) {
    // Define the version timestamp
    var version = new Date().getTime();
  
    // Regular expression pattern to match asset URLs in HTML
    var assetPattern = /(<link[^>]+href="[^"]+\.(?:css|js)[^"]*"[^>]*>)/gi;
  
    // Replace asset URLs with versioned URLs
    var versionedHTML = html.replace(assetPattern, function(match, p1) {
      return p1.replace(/(href="[^"]+\.(css|js)[^"]*")/, '$1?v=' + version);
    });
  
    return versionedHTML;
  }
  
  // Example HTML content
  var exampleHTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" href="styles.css">
    <script src="script.js"></script>
  </head>
  <body>
    <!-- ... -->
  </body>
  </html>
  `;
  
  // Apply aggressive caching to the example HTML
  var cachedHTML = applyAggressiveCaching(exampleHTML);
  
  console.log(cachedHTML); // Output the modified HTML with versioned asset URLs
  
  

function setCacheControlForHTML(htmlContent, cacheDuration) {
    // Create a new Response object with the modified Cache-Control header
    const modifiedResponse = new Response(htmlContent, {
      headers: { 'Cache-Control': `max-age=${cacheDuration}` }
    });
  
    // Return the modified HTML content as a promise
    return modifiedResponse.text();
  }
  
  // Example usage
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <!-- ... other meta tags and styles ... -->
    </head>
    <body>
      <!-- ... body content ... -->
    </body>
    </html>
  `;
  
  const cacheDurationInSeconds = 3600; // Set the desired cache duration in seconds
  
  // Set Cache-Control headers for the HTML content
  setCacheControlForHTML(htmlContent, cacheDurationInSeconds)
    .then(modifiedHtmlContent => {
      // Use the modified HTML content as needed
      console.log(modifiedHtmlContent);
    })
    .catch(error => {
      console.error('Error setting Cache-Control headers:', error);
    });
  
    function setCacheControlHeaders(htmlContent) {
        // Parse the HTML content as a DOM object
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
      
        // Define the asset URLs and corresponding cache settings
        const assets = [
          { url: 'styles.css', maxAge: 604800 }, // Example CSS asset
          // Add more assets and settings as needed
        ];
      
        // Loop through each asset and update its cache settings
        assets.forEach(asset => {
          const assetElement = doc.querySelector(`link[href*="${asset.url}"]`);
          if (assetElement) {
            // Append the Cache-Control header attribute to the asset's <link> tag
            assetElement.setAttribute('data-cache-control', `max-age=${asset.maxAge}`);
          }
        });
      
        // Serialize the modified DOM back to an HTML string
        const updatedHtmlContent = new XMLSerializer().serializeToString(doc);
        return updatedHtmlContent;
      }
      
      // Example usage
      const originalHtml = `
        <html>
          <head>
            <link rel="stylesheet" href="styles.css">
          </head>
          <body>
            <h1>Hello, world!</h1>
          </body>
        </html>
      `;
      
      const updatedHtml = setCacheControlHeaders(originalHtml);
      console.log(updatedHtml);
      

const cheerio = require('cheerio');

function setCacheControlHeaders(htmlContent) {

  const $ = cheerio.load(htmlContent);

  const assets = [{ selector: 'link[href*="styles.css"]', maxAge: 604800 },];

  assets.forEach(asset => {$(asset.selector).attr('data-cache-control', `max-age=${asset.maxAge}`);});

  return $.html();
}

// Example usage
const originalHtml = `

  <html> 
    <head>
      <link rel="stylesheet" href="styles.css">
    </head>
    <body>
      <h1>Hello, world!</h1>
    </body>
  </html>
`;

const updatedHtml = setCacheControlHeaders(originalHtml);
console.log(updatedHtml);
