
// import {generate} from 'critical';


// const dimensions = [{
// 	height: 640,	// moto G4
// 	width: 360
// },
// {
// 	height: 1024, // ipad
// 	width: 768
// },
// {
// 	height: 750, // macbook pro(ish)
// 	width: 1200
// }];


// function generateForPage(shopUrl) {
// 	console.log(`Generating critical css for url: ${shopUrl.url}...`)
// 	return generate({
// 		src: shopUrl.url,
// 		dimensions: dimensions,
// 		extract: true,
// 		// minify: true,
// 		ignore: {
// 			atrule: ['@font-face', '@keyframes', '@-moz-keyframes', '@-webkit-keyframes'],
// 			decl: (node, value) => /url\(/.test(value),
// 		},
// 		penthouse: {
// 			timeout: 60000
// 		}
// 	}).then(({css, html}) => {
// 		return {
// 			type: shopUrl.type,
// 			css: css
// 		}
// 	}).catch(e => {
// 		return {
// 			type: shopUrl.type,
// 			error: e
// 		}
// 	})
// }

// console.log(await generateForPage({url: "https://menehariya.netscapelabs.com/",type:"test"}))