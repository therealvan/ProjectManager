// Arborescence.js - Module pour scanner et générer une arborescence
const fs = require('fs');
const path = require('path');

function scanDirectory(dir, prefix = '') {
    let result = '';
    const files = fs.readdirSync(dir, { withFileTypes: true })
        .filter(file => !file.name.startsWith('.')) // Ignore les fichiers/dossiers commençant par "."
        .sort((a, b) => {
            // Trie pour mettre les dossiers en premier
            if (a.isDirectory() && !b.isDirectory()) return -1;
            if (!a.isDirectory() && b.isDirectory()) return 1;
            return a.name.localeCompare(b.name); // Trie alphabétiquement si même type
        });
    files.forEach((file, index) => {
        const isLast = index === files.length - 1;
        const filePath = path.join(dir, file.name);
        result += `${prefix}${isLast ? '└── ' : '├── '}${file.name}${file.isDirectory() ? '/' : ''}\n`;
        if (file.isDirectory()) {
            result += scanDirectory(filePath, `${prefix}${isLast ? '    ' : '│   '}`);
        }
    });
    return result;
}

function generateArborescence() {
    try {
        const arborescence = scanDirectory(__dirname);
        fs.writeFileSync(path.join(__dirname, 'Arborescence.grok'), arborescence);
        console.log('Arborescence.grok généré avec succès');
    } catch (error) {
        console.error('Erreur lors de la génération de Arborescence.grok :', error.message);
    }
}

// Exécution immédiate
generateArborescence();

module.exports = { scanDirectory, generateArborescence };
