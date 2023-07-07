const { JSDOM } = require("jsdom");
const css = require("css");

const dom = new JSDOM(`
</style><style data-shopify>
.menu-drawer__utility-links
{
    font: red;
}

.demo:{
    qwdjhqwjdhgqj:qwdqw
}
#header {
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .section-header {
    position: sticky; /* This is for fixing a Safari z-index issue. PR #2147 */
    margin-bottom: 18px;
  }

  @media screen and (min-width: 750px) {
    .section-header {
      margin-bottom: 24px;
    }
  }

  @media screen and (min-width: 990px) {
    .header {
      padding-top: 20px;
      padding-bottom: 20px;
    }
  }</style>

<header-drawer data-breakpoint="tablet">
  <details id="Details-menu-drawer-container" class="menu-drawer-container">
    <summary
      class="header__icon header__icon--menu header__icon--summary link focus-inset"
      aria-label="Menu"
    >
      <span>
        <svg
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  focusable="false"
  class="icon icon-hamburger"
  fill="none"
  viewBox="0 0 18 16"
>
  <path d="M1 .5a.5.5 0 100 1h15.71a.5.5 0 000-1H1zM.5 8a.5.5 0 01.5-.5h15.71a.5.5 0 010 1H1A.5.5 0 01.5 8zm0 7a.5.5 0 01.5-.5h15.71a.5.5 0 010 1H1a.5.5 0 01-.5-.5z" fill="currentColor">
</svg>

        <svg
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  focusable="false"
  class="icon icon-close"
  fill="none"
  viewBox="0 0 18 17"
>
  <path d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z" fill="currentColor">
</svg>

      </span>
    </summary>
    <div id="menu-drawer "  class="gradient menu-drawer motion-reduce">
      <div class="menu-drawer__inner-container">
        <div class="menu-drawer__navigation-container">
          <nav class="menu-drawer__navigation">
            <ul class="menu-drawer__menu has-submenu list-menu" role="list"><li><a
                      id="HeaderDrawer-home"
                      href="/"
                      class="menu-drawer__menu-item list-menu__item link link--text focus-inset menu-drawer__menu-item--active"
                      
                        aria-current="page"
                      
                    >
                      Home
                    </a></li><li><a
                      id="HeaderDrawer-catalog"
                      href="/collections/all"
                      class="menu-drawer__menu-item list-menu__item link link--text focus-inset"
                      
                    >
                      Catalog
                    </a></li><li><a
                      id="HeaderDrawer-contact"
                      href="/pages/contact"
                      class="menu-drawer__menu-item list-menu__item link link--text focus-inset"
                    >
                      Contact
                    </a></li><li><a
                      id="HeaderDrawer-testing"
                      href="/pages/new-warranty"
                      class="menu-drawer__menu-item list-menu__item link link--text focus-inset"
                      
                    >
                      testing
                    </a></li></ul>
          </nav>
          <div class="menu-drawer__utility-links demo"><ul class="list list-social list-unstyled" role="list"></ul>
          </div>
        </div>
      </div>
    </div>
  </details>
</header-drawer>
`);

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
          return usedSelectors.some((usedSelector) => regex.test(usedSelector));
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

// Generate the modified HTML code without the unused CSS
const modifiedHtmlCode = doc.documentElement.outerHTML;

console.log(modifiedHtmlCode);
