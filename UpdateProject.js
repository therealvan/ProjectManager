const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function updateProject() {
    console.log('Lancement de UpdateProject.js...');
    const PROJECT_DIR = path.join(__dirname);

    try {
        // Modification de Fonctions.js
        console.log('Modification de Fonctions.js...');
        const fonctionsJsContent = `
const fs = require('fs');
const path = require('path');

function listFunctionsInJsFiles() {
    const dir = path.join(__dirname);
    const jsFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
    const functionList = [];

    jsFiles.forEach(file => {
        const filePath = path.join(dir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const functionRegex = /function\\s+([a-zA-Z_]\\w*)\\s*\\([^)]*\\)/g;
        let match;
        while ((match = functionRegex.exec(content)) !== null) {
            functionList.push(\`\${file}: \${match[1]}\`);
        }
    });

    return functionList;
}

module.exports = { listFunctionsInJsFiles };
`;
        fs.writeFileSync(path.join(PROJECT_DIR, 'Fonctions.js'), fonctionsJsContent);
        console.log('Fonctions.js modifié avec succès.');

        // Création de Fonctions.grok
        console.log('Création de Fonctions.grok...');
        const fonctions = require(path.join(PROJECT_DIR, 'Fonctions.js')).listFunctionsInJsFiles();
        const grokContent = `Liste des fonctions dans les fichiers .js locaux :\n${fonctions.join('\n')}`;
        fs.writeFileSync(path.join(PROJECT_DIR, 'Fonctions.grok'), grokContent);
        console.log('Fonctions.grok créé avec succès.');

        // Ajout, commit et push
        console.log('Ajout des fichiers locaux au suivi Git...');
        execSync('git add .', { cwd: PROJECT_DIR, stdio: 'inherit' });

        console.log('Création d’un commit...');
        execSync('git commit -m "Ajout de Fonctions.js et Fonctions.grok" --allow-empty', { cwd: PROJECT_DIR, stdio: 'inherit' });

        console.log('Poussée forcée des modifications vers le dépôt distant...');
        execSync('git push origin V1.0.0 --force', { cwd: PROJECT_DIR, stdio: 'inherit' });

        console.log('Vérification du fichier dans le dépôt...');
        const files = execSync('git ls-tree -r V1.0.0 --name-only', { cwd: PROJECT_DIR }).toString().split('\n');
        console.log('Fichiers présents dans le dépôt :', files);

        console.log('UpdateProject.js terminé.');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du projet :', error.message);
    }
}

updateProject();

module.exports = { updateProject };