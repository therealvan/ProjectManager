
const fs = require('fs');
const path = require('path');

function listFunctionsInJsFiles() {
    const dir = path.join(__dirname);
    const functionList = [];

    function scanDirectory(directory) {
        const files = fs.readdirSync(directory, { withFileTypes: true });
        files.forEach(file => {
            const filePath = path.join(directory, file.name);
            if (file.isDirectory()) {
                scanDirectory(filePath);
            } else if (file.name.endsWith('.js')) {
                const content = fs.readFileSync(filePath, 'utf8');
                const functionRegex = /function\s+([a-zA-Z_]\w*)\s*\([^)]*\)/g;
                let match;
                while ((match = functionRegex.exec(content)) !== null) {
                    const relativePath = path.relative(__dirname, filePath);
                    functionList.push(`${relativePath}: ${match[1]}`);
                }
            }
        });
    }

    scanDirectory(dir);
    return functionList;
}

module.exports = { listFunctionsInJsFiles };
