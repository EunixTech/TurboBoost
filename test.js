const { JSDOM } = require('jsdom');

function replaceImgWithTag(htmlString,) {
  const dom = new JSDOM(htmlString);
  const tempElement = dom.window.document.createElement('div');
  tempElement.innerHTML = htmlString;

  const imgTags = tempElement.getElementsByTagName('img');

  for (let i = imgTags.length - 1; i >= 0; i--) {
    const imgTag = imgTags[i];
    const replacementText = dom.window.document.createTextNode(`{% include 'responsive-product-image',
    image: product.featured_image %}`);
    imgTag.parentNode.replaceChild(replacementText, imgTag);
  }

  return tempElement.innerHTML;
}

// Example usage:
// const htmlString = `{%- if card_product.media[1] != null and show_secondary_image -%}
// <img
//   srcset="
//     {%- if card_product.media[1].width >= 165 -%}{{ card_product.media[1] | image_url: width: 165 }} 165w,{%- endif -%}
//     {%- if card_product.media[1].width >= 360 -%}{{ card_product.media[1] | image_url: width: 360 }} 360w,{%- endif -%}
//     {%- if card_product.media[1].width >= 533 -%}{{ card_product.media[1] | image_url: width: 533 }} 533w,{%- endif -%}
//     {%- if card_product.media[1].width >= 720 -%}{{ card_product.media[1] | image_url: width: 720 }} 720w,{%- endif -%}
//     {%- if card_product.media[1].width >= 940 -%}{{ card_product.media[1] | image_url: width: 940 }} 940w,{%- endif -%}
//     {%- if card_product.media[1].width >= 1066 -%}{{ card_product.media[1] | image_url: width: 1066 }} 1066w,{%- endif -%}
//     {{ card_product.media[1] | image_url }} {{ card_product.media[1].width }}w
//   "
//   src="{{ card_product.media[1] | image_url: width: 533 }}"
//   sizes="(min-width: {{ settings.page_width }}px) {{ settings.page_width | minus: 130 | divided_by: 4 }}px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)"
//   alt=""
//   class="motion-reduce"
//   loading="lazy"
//   width="{{ card_product.media[1].width }}"
//   height="{{ card_product.media[1].height }}"
// >
// {%- endif -%}`;
// const updatedHTML = replaceImgWithTag(htmlString);
// console.log(updatedHTML)

module.exports =  replaceImgWithTag
