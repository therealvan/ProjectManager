
const fs = require('fs');
const path = require('path');

function listFunctionsInJsFiles() {
    const dir = path.join(__dirname);
    const jsFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
    const functionList = [];

    jsFiles.forEach(file => {
        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const functionRegex = /function\s+([a-zA-Z_]\w*)\s*\([^)]*\)/g;
        let match;
        while ((match = functionRegex.exec(content)) !== null) {
            functionList.push(`${file}: ${match[1]}`);
        }
    });

    return functionList;
}

module.exports = { listFunctionsInJsFiles };
