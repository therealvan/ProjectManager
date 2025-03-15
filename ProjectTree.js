const fs = require('fs').promises;
const path = require('path');

async function scanDirectory(dir, prefix = '', visited = new Set()) {
    try {
        const realPath = await fs.realpath(dir);
        if (visited.has(realPath)) return '';
        visited.add(realPath);

        const files = await fs.readdir(dir, { withFileTypes: true });
        const filteredFiles = files
            .filter(file => !file.name.startsWith('.'))
            .sort((a, b) => {
                if (a.isDirectory() === b.isDirectory()) {
                    return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
                }
                return a.isDirectory() ? -1 : 1;
            });

        let result = '';
        for (let i = 0; i < filteredFiles.length; i++) {
            const file = filteredFiles[i];
            const isLast = i === filteredFiles.length - 1;
            const filePath = path.join(dir, file.name);
            const suffix = file.isDirectory() ? '/' : '';
            result += `${prefix}${isLast ? '└── ' : '├── '}${file.name}${suffix}\n`;

            if (file.isDirectory()) {
                const newPrefix = `${prefix}${isLast ? '    ' : '│   '}`;
                result += await scanDirectory(filePath, newPrefix, visited);
            }
        }
        return result;
    } catch (error) {
        console.warn(`Unable to scan ${dir}: ${error.message}`);
        return '';
    }
}

async function generateTree(outputFile = 'Tree.grok') {
    try {
        const tree = await scanDirectory(__dirname);
        await fs.writeFile(
            path.join(__dirname, outputFile),
            tree,
            { encoding: 'utf8' }
        );
        console.log(`File ${outputFile} generated successfully`);

        const { listFunctionsInJsFiles } = require('./Functions.js');
        await listFunctionsInJsFiles();

        // Launch Code.js
        console.log('Executing Code.js...');
        const code = require(path.join(__dirname, 'Code.js'));
        code.writeCodeGrok();
    } catch (error) {
        console.error('Error during generation:', error.message);
        throw error;
    }
}

if (require.main === module) {
    generateTree().catch(error => {
        console.error('Execution failed:', error.message);
        process.exit(1);
    });
}

module.exports = { scanDirectory, generateTree };
