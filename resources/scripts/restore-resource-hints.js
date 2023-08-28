const { JSDOM } = require("jsdom");

module.exports = (html) => {
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    const links = doc.getElementsByTagName("link");
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.hasAttribute("rel")) {
        const relValue = link.getAttribute("rel");
        const relAttributes = relValue.split(/\s+/);
        for (const attribute of ["dns-prefetch", "preconnect", "preload"]) {
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
};
