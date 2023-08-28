const { JSDOM } = require("jsdom");

function removeDNSPrefetch(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const links = doc.getElementsByTagName("link");
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (link.hasAttribute("rel") && link.getAttribute("rel").includes("dns-prefetch")) {
      link.removeAttribute("rel");
    }
  }

  return doc.documentElement.outerHTML;
}

const html = "<html><head><link rel='dns-prefetch' href='https://example.com'></head><body></body></html>";
const modifiedHTML = removeDNSPrefetch(html);
console.log(modifiedHTML);