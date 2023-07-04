const UglifyJS = require("uglify-es");

function removeUnusedCodeFromHTML(html) {
  const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  const scriptTags = html.match(scriptRegex);
  if (!scriptTags) {
    console.log("No JavaScript code found in the HTML.");
    return html;
  }

  scriptTags.forEach((scriptTag) => {
    const jsRegex = /<script\b[^<]*>([\s\S]*?)<\/script>/i;
    const jsMatch = scriptTag.match(jsRegex);
    if (!jsMatch || !jsMatch[1]) return;

    const jsCode = jsMatch[1];
    const result = UglifyJS.minify(jsCode, { 
      compress: {
        unused: true, // Remove unused code
      },
    });

    if (result.error) {
      console.error(result.error);
    } else {
      const updatedJsCode = result.code;
      html = html.replace(jsCode, updatedJsCode);
    }
  });

  return html;
}

const htmlString = `
<html>
  <head>
    <script>
      function unusedFunction() {
        console.log('This function is not used.');
      }
      
      function usedFunction() {
        console.log('This function is used.');
      }
    </script>
  </head>
  <body>
    <h1>Hello, world!</h1>
  </body>
</html>
`;

const updatedHtmlString = removeUnusedCodeFromHTML(htmlString);
console.log(updatedHtmlString);