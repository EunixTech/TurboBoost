const { JSDOM } = require("jsdom");

function removeLinkAttributes(html) {

  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const links = doc.getElementsByTagName("link");
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (link.hasAttribute("rel")) {
      const relValue = link.getAttribute("rel");
      const relAttributes = relValue.split(/\s+/);
      for (const attribute of  ["dns-prefetch", "preconnect", "preload"]) {
        const index = relAttributes.indexOf(attribute);
        if (index !== -1) {
          relAttributes.splice(index, 1);
        }
      }
      if (relAttributes.length === 0) {
        link.removeAttribute("rel");
      } else {
        link.setAttribute("rel", relAttributes.join(" "));
      }
    }
  }

  return doc.documentElement.outerHTML;
}

const html = "<html><head><link rel='dns-prefetch' href='https://example.com'><link rel='preconnect' href='https://example.com'><link rel='preload' href='https://example.com'></head><body></body></html>";

const modifiedHTML = removeLinkAttributes(html);
console.log(modifiedHTML);
