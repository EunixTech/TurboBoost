// function removeUnusedCodeFromHTML(html) {
//     const scriptRegex = /<script\b[^<]*>([\s\S]*?)<\/script>/gi;
//     const scriptTags = html.match(scriptRegex);
//     if (!scriptTags) {
//       console.log("No JavaScript code found in the HTML.");
//       return html;
//     }
  
//     const result = {
//       usedFunctions: [],
//       unusedFunctions: []
//     };
  
//     scriptTags.forEach((scriptTag) => {
//       const jsRegex = /<script\b[^<]*>([\s\S]*?)<\/script>/i;
//       const jsMatch = scriptTag.match(jsRegex);
//       if (!jsMatch || !jsMatch[1]) return;
  
//       const jsCode = jsMatch[1];
  
//       // Find the function calls
//       const functionRegex = /manmohan\s*\(\)/;
//       const functionMatches = [...jsCode.matchAll(functionRegex)];
  
//       // Determine used and unused functions
//       for (const match of functionMatches) {
//         const funcCall = match[0];
//         const isUsed = new RegExp(`\\b${funcCall}\\b`).test(html);
//         if (isUsed) {
//           result.usedFunctions.push(funcCall);
//         } else {
//           result.unusedFunctions.push(funcCall);
//         }
//       }
  
//       // Remove the unused function calls from the JavaScript code
//       const updatedJsCode = jsCode.replace(functionRegex, (match) => {
//         if (result.usedFunctions.includes(match)) {
//           return match;
//         } else {
//           return "/* Unused code removed */";
//         }
//       });
  
//       html = html.replace(jsCode, updatedJsCode);
//     });
  
//     result.updatedHTML = html;
//     return result;
//   }
  
//   // Example usage
//   const htmlString = `
//   <html>
//     <head>
//       <script>
//         function unusedFunction() {
//           console.log('This function is not used.');
//         }
        
//         function usedFunction() {
//           console.log('This function is used.');
//         }
//       </script>
//       <script>
//         usedFunction();
//       </script>
//     </head>
//     <body>
//       <h1>Hello, world!</h1>
//     </body>
//   </html>
//   `;
  
//   const analysisResult = removeUnusedCodeFromHTML(htmlString);
//   console.log('Used Functions:', analysisResult.usedFunctions);
//   console.log('Unused Functions:', analysisResult.unusedFunctions);
//   console.log('Updated HTML:', analysisResult.updatedHTML);
  



// function removeUnusedCodeFromHTML(html) {
//   const scriptRegex = /<script\b[^<]*>([\s\S]*?)<\/script>/gi;
//   const scriptTags = html.match(scriptRegex);
//   if (!scriptTags) {
//     console.log("No JavaScript code found in the HTML.");
//     return html;
//   }

//   const result = {
//     usedFunctions: [],
//     unusedFunctions: []
//   };

//   scriptTags.forEach((scriptTag) => {
//     const jsRegex = /<script\b[^<]*>([\s\S]*?)<\/script>/i;
//     const jsMatch = scriptTag.match(jsRegex);
//     if (!jsMatch || !jsMatch[1]) return;

//     const jsCode = jsMatch[1];

//     // Find the function  
//     const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*{/g;
//     const functionMatches = jsCode.matchAll(functionRegex);

    
//     let dd = "unusedFunction";
//     // Determine used and unused functions
//     for (const match of functionMatches) {
//       const funcName = match[1];
//       console.log(`funcName`,funcName)
//       const isUsed = new RegExp(`\\b${dd}\\b`).test(html);

//       console.log(`isUsed`, isUsed)
//       if (isUsed) {
//         result.usedFunctions.push(funcName);
//       } else {
//         result.unusedFunctions.push(funcName);
//       }
//     }

//     // Remove the unused function declarations from the JavaScript code
//     const updatedJsCode = jsCode.replace(functionRegex, (match, funcName) => {
//       if (result.usedFunctions.includes(funcName)) {
//         return match;
//       } else {
//         return "/* Unused code removed */";
//       }
//     });

//     html = html.replace(jsCode, updatedJsCode);
//   });

//   result.updatedHTML = html;
//   return result;
// }

// // Example usage
// const htmlString = `
// <html>
//   <head>

//     <script>

//       function unusedFunction() {
//         console.log('This function is not used.');
//       }
      
//       function usedFunction() {
//         console.log('This function is used.');
//       }
//     </script> 

//   </head>
//   <body>
//     <h1> Hello, world!</h1>
//   </body>
// </html>`;

// const analysisResult = removeUnusedCodeFromHTML(htmlString);
// console.log('Used Functions:', analysisResult.usedFunctions);
// console.log('Unused Functions:', analysisResult.unusedFunctions);
// console.log('Updated HTML:', analysisResult.updatedHTML);








const eslint = require('eslint');

// Create an ESLint instance
const linter = new eslint.ESLint();

// Specify the file or directory containing your theme's JavaScript files
const files = './test.js';

// Define ESLint configuration options
const options = {
  ignore: true, // Ignore .eslintignore file if present
};

// Run ESLint analysis on the specified files
linter
  .lintFiles(files, options)
  .then((results) => {
    // Extract unused code from ESLint results
    const unusedCode = results.reduce((acc, result) => {
      const unused = result.messages.filter((message) => message.ruleId === 'no-unused-vars');
      return acc.concat(unused);
    }, []);

    // Remove unused code from the JavaScript files
    unusedCode.forEach((unused) => {
      const { line, column } = unused.location.start;
      console.log(`Unused code found at line ${line}, column ${column}: ${unused.message}`);
      // TODO: Remove the unused code from the file
    });
  })
  .catch((error) => {
    console.error('An error occurred during ESLint analysis:', error);
  });
