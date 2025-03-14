// Arborescence.js - Module pour scanner et générer une arborescence
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
                    return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
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
        console.warn(`Impossible de scanner ${dir}: ${error.message}`);
        return '';
    }
}

async function generateArborescence(outputFile = 'Arborescence.grok') {
    try {
        const arborescence = await scanDirectory(__dirname);
        await fs.writeFile(
            path.join(__dirname, outputFile),
            arborescence,
            { encoding: 'utf8' }
        );
        console.log(`Fichier ${outputFile} généré avec succès`);

        // Chargement et exécution explicite de listFunctionsInJsFiles depuis Fonctions.js
        const { listFunctionsInJsFiles } = require('./Fonctions.js');
        await listFunctionsInJsFiles(); // Appel explicite de la fonction
    } catch (error) {
        console.error('Erreur lors de la génération :', error.message);
        throw error;
    }
}

if (require.main === module) {
    generateArborescence().catch(error => {
        console.error('Échec de l\'exécution:', error.message);
        process.exit(1);
    });
}

module.exports = { scanDirectory, generateArborescence };