
const fs = require('fs');
const path = require('path');

function listFunctionsInProject(dir) {
    let results = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            results = results.concat(listFunctionsInProject(fullPath));
        } else if (file.name.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const functionRegex = /function\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)|const\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*\([^)]*\)\s*=>/g;
            let match;
            while ((match = functionRegex.exec(content)) !== null) {
                const functionName = match[1] || match[2];
                if (functionName) {
                    results.push(`${file.name}: ${functionName}`);
                }
            }
        }
    }
    return results;
}

function generateFonctionsGrok() {
    const projectDir = path.join(__dirname);
    const functionsList = listFunctionsInProject(projectDir);
    const output = `Liste des fonctions dans le projet :\n${functionsList.join('\n')}`;
    fs.writeFileSync(path.join(projectDir, 'Fonctions.grok'), output, 'utf8');
    console.log('Fonctions.grok généré avec succès.');
}

module.exports = { listFunctionsInProject, generateFonctionsGrok };
