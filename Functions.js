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
                const functionRegex = /(?:function\s+([a-zA-Z_]\w*)\s*\([^)]*\)|const\s+([a-zA-Z_]\w*)\s*=\s*\([^)]*\)\s*=>|([a-zA-Z_]\w*)\s*:\s*function\s*\([^)]*\))/g;
                let match;
                while ((match = functionRegex.exec(content)) !== null) {
                    const relativePath = path.relative(__dirname, filePath);
                    const functionName = match[1] || match[2] || match[3];
                    functionList.push(`${relativePath}: ${functionName}`);
                }
            }
        });
    }

    try {
        scanDirectory(dir);
        const outputPath = path.join(__dirname, 'Functions.grok');
        fs.writeFileSync(outputPath, functionList.join('\n'), 'utf8');
        console.log(`Successfully wrote ${functionList.length} functions to Functions.grok`);
        return functionList;
    } catch (error) {
        console.error('Error processing files:', error);
        return [];
    }
}

module.exports = { listFunctionsInJsFiles };

if (require.main === module) {
    listFunctionsInJsFiles();
}s