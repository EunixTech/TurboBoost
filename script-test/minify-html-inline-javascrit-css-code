const minify = require('html-minifier').minify;

function minifyHTML(html) {
  const minifiedHTML = minify(html, {
    collapseWhitespace: true,    // Remove white spaces
    removeComments: true,        // Remove HTML comments
    minifyCSS: true,             // Minify CSS within <style> tags
    minifyJS: true,              // Minify JavaScript within <script> tags
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    removeAttributeQuotes: true,  // Remove unnecessary quotes from attributes
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
  });

  return minifiedHTML;
}


const originalHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sample HTML</title>
  <style type="text/css">
    body {
      background-color: red;
    }
  </style>
</head>
<body>
  <!-- This is a comment -->
  <div class="container">
    <h1 class="heading">Hello, World!</h1>
    <p>Welcome to my website.</p>
    <img src="image.jpg" alt="Sample Image" />
    <a href="#" class="btn">Click me</a>
    <input type="text" value="Input Text" />
    <script type="text/javascript">
      // Sample JavaScript
      function hello() {
        alert("Hello, world!");
      }
      hello();
    </script>
  </div>
</body>
</html>

`;

const minifiedHTML = minifyHTML(originalHTML);
console.log(minifiedHTML);
