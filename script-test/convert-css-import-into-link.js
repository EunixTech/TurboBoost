function convertStylesheets(html) {
    // Find and replace stylesheet_tag occurrences
    const modifiedHtml = html.replace(
      /\{\{\s*(['"])([\w.-]+)\s*\|\s*asset_url\s*\1\s*\|\s*stylesheet_tag\s*\}\}/g,
      '<link rel="stylesheet" href="{{ $2 | asset_url }}" />'
    );
  
    // Convert remaining <link> elements
    const parser = new DOMParser();
    const doc = parser.parseFromString(modifiedHtml, 'text/html');
  
    const links = doc.querySelectorAll('link[rel="stylesheet"]');
    links.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && href.includes('{{') && href.includes('| asset_url }}')) {
        link.setAttribute('href', `{{ ${href} }}`);
      }
    });
  
    return doc.documentElement.outerHTML;
  }
  
  // Example usage
  const inputHtml = `
    <!-- Your HTML content here -->
  `; // Your input HTML string
  
  const updatedHtml = convertStylesheets(inputHtml);
  console.log(updatedHtml);
  