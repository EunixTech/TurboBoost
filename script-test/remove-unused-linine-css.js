const Axios = require("axios");
const Cheerio = require("cheerio");

async function getThemeAssets() {

  try {
    
    const response = await Axios.get(
      `https://${shopifyStoreDomain}/admin/api/2021-07/themes/${themeId}/assets.json`,
      {
        auth: {
          username: "apiKey",
          password: "password",
        },
      }
    );

    return response.data.assets;
  } catch (error) {
    console.error("Error fetching theme assets:", error.message);
    return [];
  }
}

async function getUsedSelectors() {
  try {
    const response = await Axios.get(`https://${shopifyStoreDomain}`);

    const html = response.data;
    const $ = Cheerio.load(html);
    const usedSelectors = new Set();

    $("*").each(function () {
      const element = $(this);
      const elementClasses = element.attr("class");
      const elementIds = element.attr("id");

      console.log(`elementClasses`, elementClasses);
      console.log(`elementIds`, elementIds);
      //   if (elementClasses) {
      //     elementClasses.split(' ').forEach((className) => usedSelectors.add(`.${className}`));
      //   }

      //   if (elementIds) {
      //     usedSelectors.add(`#${elementIds}`);
      //   }
    });

    return Array.from(usedSelectors);
  } catch (error) {
    console.error("Error fetching storefront:", error.message);
    return [];
  }
}

function removeUnusedCSS(
  cssContent = `.man:{font:red} .man1:{font:red} .man2:{font:red} .man9:{font:red}`,
  unusedSelectors = [".man", ".man2", ".man4", ".man4", ".man5", ".man6"]
) {
  let modifiedContent = cssContent;

  unusedSelectors.forEach((selector) => {
    const regex = new RegExp(`\\b${selector}\\s*{[^}]*}`, "g");
    modifiedContent = modifiedContent.replace(regex, "");
  });

  console.log(`modifiedContent`, modifiedContent);

  return modifiedContent;
}

async function updateThemeAssets(updatedAssets) {
  try {
    const response = await Axios.put(
      `https://${shopifyStoreDomain}/admin/api/2021-07/themes/${themeId}/assets.json`,
      {
        asset: updatedAssets,
      },
      {
        auth: {
          username: "a50a540950555a0188574ba6475e53ef",
          password: "password",
        },
      }
    );

    console.log("Theme assets updated successfully:", response.data.asset);
  } catch (error) {
    console.error("Error updating theme assets:", error.message);
  }
}

async function main() {
  try {
    const themeAssets = await getThemeAssets();
    const cssAssets = themeAssets.filter(
      (asset) => asset.content_type === "text/css"
    );

    if (cssAssets.length === 0) {
      console.log("No CSS files found in the theme assets.");
      return;
    }

    const cssAsset = cssAssets[0]; // Assuming you have only one CSS file
    const cssContent = cssAsset.value;

    // Collect and identify unused selectors
    // const usedSelectors = await getUsedSelectors();

    const usedSelectors = [".man", ".man2", ".man4"];

    const allSelectors = [".man", ".man2", ".man4", ".man4", ".man5", ".man6"]; // Replace with all selectors from your theme
    const unusedSelectors = allSelectors.filter(
      (selector) => !usedSelectors.includes(selector)
    );

    // Remove unused CSS rules
    const modifiedCSS = removeUnusedCSS(cssContent, unusedSelectors);

    // Update the theme assets
    const updatedAssets = {
      key: cssAsset.key,
      value: modifiedCSS,
    };

    await updateThemeAssets(updatedAssets);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

main();

// script for removing unused css code
// function removeUnusedCss(cssCode, unusedCss) {
//   // Create a regular expression pattern to match the selectors and their blocks
//   const pattern = new RegExp(
//     `(^|\\})\\s*(${unusedCss.join("|")})\\s*{[\\s\\S]*?\\}`,
//     "gm"
//   );

//   // Remove the matching CSS code
//   const modifiedCssCode = cssCode.replace(pattern, "");

//   return modifiedCssCode;
// }
