const { JSDOM } = require("jsdom");
const css = require("css");

const dom = new JSDOM();

const doc = dom.window.document;
const usedSelectors = [];
const elements = doc.querySelectorAll("*");
for (const element of elements) {
  const classList = Array.from(element.classList);
  const id = element.getAttribute("id");
  usedSelectors.push(...classList, `#${id}`); // Add # before the ID selector
}

// Remove unused CSS rules
const stylesheets = doc.querySelectorAll("style");
for (const stylesheet of stylesheets) {
  const ast = css.parse(stylesheet.textContent);
  const filteredRules = ast.stylesheet.rules.filter((rule) => {
    if (rule.type === "rule") {
      return rule.selectors.some((selector) => {
        if (selector.startsWith(".")) {
          // Match class selector
          const className = selector.slice(1);
          const regex = new RegExp(`^${className}$`, "i");
          return usedSelectors.some((usedSelector) =>
            regex.test(usedSelector)
          );
        } else if (selector.startsWith("#")) {
          // Match ID selector
          const id = selector.slice(1);
          return usedSelectors.includes(`#${id}`);
        } else {
          // Match element selector
          return usedSelectors.includes(selector);
        }
      });
    }
    return true;
  });
  ast.stylesheet.rules = filteredRules;
  stylesheet.textContent = css.stringify(ast);
}

const modifiedHtmlCode = doc.documentElement.outerHTML;