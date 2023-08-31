function removeAttributesFromImgTag(html) {
    // Create a temporary element to parse the HTML string
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
  
    // Find the <img> tag
    const imgTag = tempElement.querySelector('img');
  
    // Remove the specified attributes
    imgTag.removeAttribute('data-sizes');
    imgTag.removeAttribute('data-widths');
  
    // Return the modified HTML string
    return tempElement.innerHTML;
  }
  
  // Example usage
  const htmlString = '<img id="Image-123" class="responsive-image__image lazyload" src="image.jpg" data-src="image.jpg" data-widths="[180,360,540]" data-aspectratio="1.5" data-sizes="auto" tabindex="-1" alt="Image">';
  const modifiedHtmlString = removeAttributesFromImgTag(htmlString);
  console.log(modifiedHtmlString);