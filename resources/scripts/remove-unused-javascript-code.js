const esprima = require('esprima'),
    estraverse = require('estraverse'),
    escodegen = require('escodegen');

const removeUnusedJavascritCode = (html) => {
    const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    const scriptTags = html.match(scriptRegex);
    if (!scriptTags) {
        console.log("No JavaScript code found in the HTML.");
        return html;
    }

    scriptTags.forEach((scriptTag) => {
        const jsRegex = /<script\b[^<]*>([\s\S]*?)<\/script>/i;
        const jsMatch = scriptTag.match(jsRegex);
        if (!jsMatch || !jsMatch[1]) return;

        const jsCode = jsMatch[1];

        // Parse the JavaScript code
        const ast = esprima.parseScript(jsCode);

        // Find the function declarations
        const functionDeclarations = [];
        estraverse.traverse(ast, {
            enter(node) {
                if (node.type === 'FunctionDeclaration') {
                    functionDeclarations.push(node);
                }
            }
        });

        // Find the unused function names
        const usedFunctionNames = new Set();
        functionDeclarations.forEach((declaration) => {
            const funcName = declaration.id.name;
            const isUsed = new RegExp(`\\b${funcName}\\b`).test(html);
            if (isUsed) {
                usedFunctionNames.add(funcName);
            }
        });

        // Remove the unused functions from the AST
        functionDeclarations.forEach((declaration) => {
            const funcName = declaration.id.name;
            if (!usedFunctionNames.has(funcName)) {
                estraverse.replace(declaration, {
                    enter() {
                        return estraverse.VisitorOption.Remove;
                    }
                });
            }
        });

        // Generate the updated JavaScript code
        const updatedJsCode = escodegen.generate(ast);

        html = html.replace(jsCode, updatedJsCode);
    });

    return html;
}

module.exports = removeUnusedJavascritCode;


