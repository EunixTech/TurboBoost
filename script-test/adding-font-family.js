function addFontDisplayToFontFace(minifiedCss) {
  const fontFaceRegex = /@font-face\s*\{[\s\S]*?\}/g;

  const updatedCss = minifiedCss.replace(fontFaceRegex, match => {
    // Check if font-display property already exists
    if (match.includes('font-display')) {
      return match;
    }

    // Check if semicolon is missing at the end of src property
    if (!match.includes(';')) {
      return match.replace('}', 'font-display: swap; }');
    }

    return match.replace('}', 'font-display: swap; }');
  });

  return updatedCss;
}

// Sample CSS content
const sampleCss = `
  @font-face {
    font-family: 'YourFont';
    src: url('your-font.woff2') format('woff2')
  }
`;

const updatedCss = addFontDisplayToFontFace(sampleCss);
console.log(updatedCss);
