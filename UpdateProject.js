const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function updateProject() {
    console.log('Lancement de UpdateProject.js...');
    
    const githubJsPath = path.join(__dirname, 'src/GitHub/GitHub.js');
    let githubContent = fs.readFileSync(githubJsPath, 'utf8');
    
    // Correction de la syntaxe et définition correcte des fonctions
    const correctedContent = `
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getCurrentBranch() {
    try {
        return fs.readFileSync(path.join(__dirname, '../../Branche.git'), 'utf8').trim();
    } catch (error) {
        console.error('Erreur lors de la lecture de Branche.git :', error.message);
        return 'main'; // Branche par défaut si erreur
    }
}

function addFiles(files) {
    execSync('git add ' + files, { stdio: 'inherit' });
    console.log('Fichiers ajoutés à l’index.');
}

function commitChanges(message) {
    execSync('git commit -m "' + message + '"', { stdio: 'inherit' });
    console.log('Commit créé avec succès.');
}

function pushChanges() {
    const branch = getCurrentBranch();
    console.log('Pousse vers la branche :', branch);
    execSync('git push origin ' + branch, { stdio: 'inherit' });
}

module.exports = { addFiles, commitChanges, pushChanges };
    `;
    
    fs.writeFileSync(githubJsPath, correctedContent, 'utf8');
    console.log('GitHub.js corrigé.');
    
    // Exécution du push
    const { addFiles, commitChanges, pushChanges } = require('./src/GitHub/GitHub.js');
    addFiles('.');
    console.log('Fichiers ajoutés.');
    commitChanges('Mise à jour depuis UpdateProject.js');
    console.log('Changements commités.');
    pushChanges();
    console.log('Changements poussés vers GitHub.');
    
    console.log('UpdateProject.js terminé.');
}

updateProject();

module.exports = { updateProject };