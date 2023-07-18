const codeSnippet = `
<div
  class="
    card
    card--{{ settings.card_style }}
    {% if card_product.featured_media %} card--media{% else %} card--text{% endif %}
    {% if settings.card_style == 'card' %} color-{{ settings.card_color_scheme }} gradient{% endif %}
    {% if image_shape and image_shape != 'default' %} card--shape{% endif %}
    {% if extend_height %} card--extend-height{% endif %}
    {% if card_product.featured_media == nil and settings.card_style == 'card' %} ratio{% endif %}
    {% if horizontal_class %} card--horizontal{% endif %}
  "
  style="--ratio-percent: {{ 1 | divided_by: ratio | times: 100 }}%;"
>
  <div
    class="card__inner {% if settings.card_style == 'standard' %}color-{{ settings.card_color_scheme }} gradient{% endif %}{% if card_product.featured_media or settings.card_style == 'standard' %} ratio{% endif %}"
    style="--ratio-percent: {{ 1 | divided_by: ratio | times: 100 }}%;"
  >
    {%- if card_product.featured_media -%}
      <div class="card__media{% if image_shape and image_shape != 'default' %} shape--{{ image_shape }} color-{{ settings.card_color_scheme }} gradient{% endif %}">
        <div class="media media--transparent media--hover-effect">
          {% comment %}theme-check-disable ImgLazyLoading{% endcomment %}
          <img
            srcset="
              {%- if card_product.featured_media.width >= 165 -%}{{ card_product.featured_media | image_url: width: 165 }} 165w,{%- endif -%}
              {%- if card_product.featured_media.width >= 360 -%}{{ card_product.featured_media | image_url: width: 360 }} 360w,{%- endif -%}
              {%- if card_product.featured_media.width >= 533 -%}{{ card_product.featured_media | image_url: width: 533 }} 533w,{%- endif -%}
              {%- if card_product.featured_media.width >= 720 -%}{{ card_product.featured_media | image_url: width: 720 }} 720w,{%- endif -%}
              {%- if card_product.featured_media.width >= 940 -%}{{ card_product.featured_media | image_url: width: 940 }} 940w,{%- endif -%}
              {%- if card_product.featured_media.width >= 1066 -%}{{ card_product.featured_media | image_url: width: 1066 }} 1066w,{%- endif -%}
              {{ card_product.featured_media | image_url }} {{ card_product.featured_media.width }}w
            "
            src="{{ card_product.featured_media | image_url: width: 533 }}"
            sizes="(min-width: {{ settings.page_width }}px) {{ settings.page_width | minus: 130 | divided_by: 4 }}px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)"
            alt="{{ card_product.featured_media.alt | escape }}"
            class="motion-reduce"
            {% unless lazy_load == false %}
              loading="lazy"
            {% endunless %}
            width="{{ card_product.featured_media.width }}"
            height="{{ card_product.featured_media.height }}"
          >
          {% comment %}theme-check-enable ImgLazyLoading{% endcomment %}

          {%- if card_product.media[1] != null and show_secondary_image -%}
            <img
              srcset="
                {%- if card_product.media[1].width >= 165 -%}{{ card_product.media[1] | image_url: width: 165 }} 165w,{%- endif -%}
                {%- if card_product.media[1].width >= 360 -%}{{ card_product.media[1] | image_url: width: 360 }} 360w,{%- endif -%}
                {%- if card_product.media[1].width >= 533 -%}{{ card_product.media[1] | image_url: width: 533 }} 533w,{%- endif -%}
                {%- if card_product.media[1].width >= 720 -%}{{ card_product.media[1] | image_url: width: 720 }} 720w,{%- endif -%}
                {%- if card_product.media[1].width >= 940 -%}{{ card_product.media[1] | image_url: width: 940 }} 940w,{%- endif -%}
                {%- if card_product.media[1].width >= 1066 -%}{{ card_product.media[1] | image_url: width: 1066 }} 1066w,{%- endif -%}
                {{ card_product.media[1] | image_url }} {{ card_product.media[1].width }}w
              "
              src="{{ card_product.media[1] | image_url: width: 533 }}"
              sizes="(min-width: {{ settings.page_width }}px) {{ settings.page_width | minus: 130 | divided_by: 4 }}px, (min-width: 990px) calc((100vw - 130px) / 4), (min-width: 750px) calc((100vw - 120px) / 3), calc((100vw - 35px) / 2)"
              alt=""
              class="motion-reduce"
              loading="lazy"
              width="{{ card_product.media[1].width }}"
              height="{{ card_product.media[1].height }}"
            >
          {%- endif -%}
        </div>
      </div>
    {%- endif -%}. write script that replace with  all img tag with {% include 'responsive-product-image', image: product.featured_image %} in javascript
`;

const replacedCodeSnippet = codeSnippet.replace(/<img\b[^>]*>/gi, "{% include 'responsive-product-image', image: product.featured_image %}");

console.log(replacedCodeSnippet);
