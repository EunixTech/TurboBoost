function swapFontDisplay(cssContent) {
  
    const regex = /@font-face\s*{([^}]*)}/g;
    const updatedCssContent = cssContent.replace(regex, (match) => {
      const updatedMatch = match.replace(/font-display:[^;]+;/, 'font-display:swap;');
      return updatedMatch;
    });
    return updatedCssContent;
  }
module.exports = swapFontDisplay