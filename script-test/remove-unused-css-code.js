
async function getThemeAssets() {
  try {
    const response = await axios.get(`https://${shopifyStoreDomain}/admin/api/2021-07/themes/${themeId}/assets.json`, {
      auth: {
        username: apiKey,
        password: password,
      },
    });

    return response.data.assets;
  } catch (error) {
    console.error('Error fetching theme assets:', error.message);
    return [];
  }
}

async function getUsedSelectors() {
  try {
    const response = await axios.get(`https://${shopifyStoreDomain}`);

    const html = response.data;
    const $ = cheerio.load(html);
    const usedSelectors = new Set();

    $('*').each(function () {
      const element = $(this);
      const elementClasses = element.attr('class');
      const elementIds = element.attr('id');

      if (elementClasses) {
        elementClasses.split(' ').forEach((className) => usedSelectors.add(`.${className}`));
      }

      if (elementIds) {
        usedSelectors.add(`#${elementIds}`);
      }
    });

    return Array.from(usedSelectors);
  } catch (error) {
    console.error('Error fetching storefront:', error.message);
    return [];
  }
}

function removeUnusedCSS(cssContent, unusedSelectors) {
  let modifiedContent = cssContent;

  unusedSelectors.forEach((selector) => {
    const regex = new RegExp(`\\b${selector}\\s*{[^}]*}`, 'g');
    modifiedContent = modifiedContent.replace(regex, '');
  });

  return modifiedContent;
}

async function updateThemeAssets(updatedAssets) {
  try {
    const response = await axios.put(`https://${shopifyStoreDomain}/admin/api/2021-07/themes/${themeId}/assets.json`, {
      asset: updatedAssets,
    }, {
      auth: {
        username: apiKey,
        password: password,
      },
    });

    console.log('Theme assets updated successfully:', response.data.asset);
  } catch (error) {
    console.error('Error updating theme assets:', error.message);
  }
}

async function main() {
  try {
    const themeAssets = await getThemeAssets();
    const cssAssets = themeAssets.filter((asset) => asset.content_type === 'text/css');

    if (cssAssets.length === 0) {
      console.log('No CSS files found in the theme assets.');
      return;
    }

    const cssAsset = cssAssets[0]; // Assuming you have only one CSS file
    const cssContent = cssAsset.value;

    // Collect and identify unused selectors
    const usedSelectors = await getUsedSelectors();
    const allSelectors = ['selector1', 'selector2', 'selector3', 'selector4', 'selector5']; // Replace with all selectors from your theme
    const unusedSelectors = allSelectors.filter((selector) => !usedSelectors.includes(selector));

    // Remove unused CSS rules
    const modifiedCSS = removeUnusedCSS(cssContent, unusedSelectors);

    // Update the theme assets
    const updatedAssets = {
      key: cssAsset.key,
      value: modifiedCSS,
    };

    await updateThemeAssets(updatedAssets);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
