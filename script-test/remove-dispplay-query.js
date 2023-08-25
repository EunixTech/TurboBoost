
function removeDisplaySwapQuery(htmlContent) {
    // Regular expression to match Google Font API links with display=swap query parameter
    const pattern = /<link\s+href="https:\/\/fonts.googleapis.com\/css2[^"]+display=swap"[^>]*>/g;

    // Replace display=swap with an empty string in each match
    const modifiedContent = htmlContent.replace(pattern, match => match.replace('&display=swap', ''));

    return modifiedContent;
}

const dd  = removeDisplaySwapQuery(`<!DOCTYPE html>
<html>
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap" rel="stylesheet">
    <title>Example</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>
`)


console.log(`dd`,dd)

