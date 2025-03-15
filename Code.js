const fs = require('fs');
const path = require('path');

function scanDirectory(dir) {
    let results = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            results = results.concat(scanDirectory(fullPath));
        } else if (file.name.endsWith('.js') && file.name !== 'UpdateProject.js') {
            results.push(fullPath);
        }
    }
    return results;
}

function writeCodeGrok() {
    const projectDir = __dirname;
    const jsFiles = scanDirectory(projectDir);
    let codeContent = '';

    for (const file of jsFiles) {
        const content = fs.readFileSync(file, 'utf8');
        codeContent += `// Contenu de ${path.relative(projectDir, file)}
${content}

`;
    }

    fs.writeFileSync(path.join(projectDir, 'code.grok'), codeContent);
    console.log('code.grok créé avec succès.');
}

writeCodeGrok();
