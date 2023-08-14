const AddDisplayProperties = (htmlContent) => {
    const fontPattern = /https:\/\/fonts\.googleapis\.com\/css2\?[^"]+/g;
    const fontLinks = htmlContent.match(fontPattern);
  
    let modifiedHtml = htmlContent;
    fontLinks.forEach(link => {
        if (!/display=swap/.test(link)) {
            const modifiedLink = link.replace(/(\?[^"]+)/, '$1&display=swap');
            modifiedHtml = modifiedHtml.replace(link, modifiedLink);
        }
    });
  
    return modifiedHtml;
}

const exampleHtml = `
<!DOCTYPE html>
<html>
<head>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100" rel="stylesheet">
</head>
<body>
    <h1>Hello, Google Fonts!</h1>
</body>
</html>
`;

const modifiedHtml = AddDisplayProperties(exampleHtml);
console.log(modifiedHtml);
