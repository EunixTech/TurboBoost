const UglifyJS = require('uglify-js');

function minifyJavaScriptCode(inputCode) {
    try {
        // Minify the JavaScript code
        const result = UglifyJS.minify(inputCode, {
            compress: {
                drop_console: true, // Remove console.log statements
                passes: 2 // Run the compressor multiple times for better compression
            },
            mangle: true // Mangle variable and function names
        });

        // Check for errors during minification
        if (result.error) {
            console.error('Error during minification:', result.error);
            return null;
        }

        // Return the minified code
        return result.code;
    } catch (error) {
        console.error('An error occurred:', error.message);
        return null;
    }
}

module.exports = minifyJavaScriptCode
