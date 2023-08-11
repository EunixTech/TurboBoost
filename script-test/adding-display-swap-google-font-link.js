const AddDisplaProperties = (htmlContent) => {

    const fontPattern = /https:\/\/fonts\.googleapis\.com\/css\?.*/g;
    const fontLinks = htmlContent.match(fontPattern);
  
    let modifiedHtml = htmlContent;
    fontLinks.forEach(link => {
      const modifiedLink = link + '&display=swap';
      modifiedHtml = modifiedHtml.replace(link, modifiedLink);
    });
  
    return modifiedHtml;
}

console.log(AddDisplaProperties(`<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Hello, Google Fonts!</h1>
</body>
</html>`))






// module.exports = AddDisplaProperties