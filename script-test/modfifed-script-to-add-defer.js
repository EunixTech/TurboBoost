const cheerio = require('cheerio');

function addDeferToElements(html) {
  
    const $ = cheerio.load(html);

    $('link, script').each(function() {
        const element = $(this);
        const href = element.attr('href') || element.attr('src');

        if (!href.includes('critical') && !href.includes('font')) {
            if (!element.attr('defer')) {
                element.attr('defer', 'defer');
            }
        }
    });

    return $.html();
}

// Example usage
const html = `
    <html>
        <head>
            <link href="styles.css">
            <link href="theme-critical.css">
            <link href="google-font.css">
            <script src="{{ 'theme.critical.js' | asset_url }}"></script>
        </head>
        <body>
            <h1>Hello, world!</h1>
        </body>
    </html> 
`;

const updatedHtml = addDeferToElements(html);
console.log(updatedHtml);