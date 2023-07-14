// Function to parse CSS content and extract @font-face declarations
function parseFontFaceDeclarations(cssContent) {
    const regex = /@font-face\s*{([^}]*)}/g;
    const fontFaceDeclarations = [];
    
    let match;
    while ((match = regex.exec(cssContent)) !== null) {
      const fontFaceDeclaration = match[0];
      fontFaceDeclarations.push(fontFaceDeclaration);
    }
    
    return fontFaceDeclarations;
  }
  
  // Read @font-face declarations from the <style> element
  function readFontFaceDeclarations() {
    const styleElement = document.querySelector('style');
    if (!styleElement) {
      console.log('No <style> element found.');
      return;
    }
    
    const cssContent = styleElement.innerHTML;
    const fontFaceDeclarations = parseFontFaceDeclarations(cssContent);
    
    // Log the @font-face declarations
    console.log('Font Face Declarations:');
    fontFaceDeclarations.forEach((declaration, index) => {
      console.log(`Declaration ${index + 1}:`);
      console.log(declaration);
    });
  }
  
  // Call the function to read @font-face declarations
  readFontFaceDeclarations();
  