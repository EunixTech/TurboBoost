function commentOutIncludes(html) {
    const includePattern = /{%\s*include\s*'responsive-image'.*?%}/g;
    return html.replace(includePattern, match => `<!-- ${match} -->`);
}

// Example usage
const inputHtml = `
    <html>
        <body>
            {% include 'responsive-image' with image: featured_image, image_class: "css-class", wrapper_class: "wrapper-css-class", max_width: 700, max_height: 800 %}
            <p>This is a paragraph.</p>
        </body>
    </html>
`;

const modifiedHtml = commentOutIncludes(inputHtml);
console.log(modifiedHtml);
