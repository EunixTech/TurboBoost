const fs = require('fs');
const path = require('path');


async function uploadShopifySnippets(shopifyAdmin, snippets ) {
	// Create a snippet for each page that has critical css
    const readAndPushToAssetFetches = (filePath, name) => {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return {
            name: `snippets/${name}`,
            value: fileContent
        };
    };
    
    const bgsetFilePath = path.join(__dirname, '../lib/shopify/advanced-lazy-loading/Bgset.liquid');
    const lazyLoadingFilePath = path.join(__dirname, '../lib/shopify/advanced-lazy-loading/lazy-loading-script.js');
    const responsiveImagfilePath = path.join(__dirname, '../lib/shopify/advanced-lazy-loading/responsive-image.liquid');
    
    const assetFetches = [
        readAndPushToAssetFetches(bgsetFilePath, 'Bgset.liquid'),
        readAndPushToAssetFetches(responsiveImagfilePath, 'responsive-image.liquid'),
        readAndPushToAssetFetches(lazyLoadingFilePath, 'lazy-loading-script.js')
    ];

    
	const assetFetchesArr = [];
	assetFetches.forEach(async snippet => {

		assetFetchesArr.push(shopifyAdmin.writeAsset({
			name:snippet?.name ,
			value: snippet.value
		}));
	});

	await Promise.all(assetFetchesArr);
}

module.exports = {
	uploadShopifySnippets
}