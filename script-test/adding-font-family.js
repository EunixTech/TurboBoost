function addFontDisplayToFontFace(minifiedCss) {
    const fontFaceRegex = /@font-face\s*\{[\s\S]*?\}/g;
    const fontFaceMatches = minifiedCss.match(fontFaceRegex);
  
    if (fontFaceMatches && fontFaceMatches.length > 0) {
      const updatedCss = minifiedCss.replace(fontFaceRegex, match => {
        // Check if font-display property already exists
        if (match.includes('font-display')) {
          return match;
        }
  
        // Add font-display property
        return match.replace('}', 'font-display: swap;}');
      });
  
      return updatedCss;
    }
  
    return minifiedCss;
  }
  
  // Example minified CSS
  const minifiedCss = `

    /* Your minified CSS here */
    
    @font-face {
      font-family: 'YourFon2t';
      src: url('your-font.woff2') format('woff2');
    }
    @font-face {
        font-family: 'YourFont';
        src: url('your-font.woff2') format('woff2');
      }

      @font-face {
        font-family: 'YourFon276t';
        src: url('your-font.woff2') format('woff2');
      }
    /* ... other rules ... */
  `;
  
  const updatedCss = addFontDisplayToFontFace(minifiedCss);
  console.log(updatedCss);
  