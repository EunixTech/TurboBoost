const cheerio = require('cheerio');

function replaceBackgroundImage(htmlCode) {
  const $ = cheerio.load(htmlCode);

  // Find all elements with style attribute containing background-image
  $('[style*=background-image]').each(function () {
    const element = $(this);

    // Replace the element with {% include 'responsive-image' ... %}
    const newElement = `
      {% include 'responsive-image' with image: collection.image, image_class: "css-class", wrapper_class: "wrapper-css-class ${element.attr('class')}", max_width: 700, max_height: 800 %}
    `;

    element.replaceWith(newElement);
  });

  return $.html();
}

// Example usage
const htmlInput = `
<html><head></head><body>
<div class="collection-hero">
    <div class="collection-hero__image" style="background-image: url({{ collection.image | img_url: '2048x600', crop: 'top' }});"></div>
    <div class="collection-hero__title-wrapper">
        <h1 class="collection-hero__title page-width">{{ collection.title }}</h1>
    </div>
</div>
</body></html>
`;

const modifiedHtml = replaceBackgroundImage(htmlInput);
console.log(modifiedHtml);
