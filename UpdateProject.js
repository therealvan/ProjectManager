const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

// Fonction principale pour mettre à jour le projet
function updateProject() {
    // Chemin vers GitHub.js
    const githubPath = path.join(__dirname, 'src/GitHub/GitHub.js');
    
    // Nouvelle implémentation de GitHub.js avec addFiles corrigé
    const githubContent = `
const { execSync } = require('child_process');

function addFiles(files = '.') {
    try {
        execSync(\`git add \${files}\`, { stdio: 'inherit' });
        console.log('Fichiers ajoutés avec succès.');
    } catch (error) {
        console.error('Erreur lors de l’ajout des fichiers :', error.message);
        throw error;
    }
}

function commitChanges(message, allowEmpty = false) {
    try {
        execSync(\`git commit \${allowEmpty ? '--allow-empty ' : ''}-m "\${message}"\`, { stdio: 'inherit' });
        console.log('Commit créé avec succès.');
    } catch (error) {
        console.error('Erreur lors du commit :', error.message);
        throw error;
    }
}

function pushChanges() {
    try {
        execSync('git push', { stdio: 'inherit' });
        console.log('Push effectué avec succès.');
    } catch (error) {
        console.error('Erreur lors du push :', error.message);
        throw error;
    }
}

module.exports = { addFiles, commitChanges, pushChanges };
    `;
    
    // Écriture du nouveau GitHub.js
    fs.writeFileSync(githubPath, githubContent, 'utf8');
    console.log('GitHub.js mis à jour avec une implémentation corrigée.');
    
    // Ajoute, commit et push les modifications
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit --allow-empty -m "Correction de GitHub.js via UpdateProject.js"', { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });
    
    console.log('Modifications poussées vers le dépôt distant.');
}

// Exécute la mise à jour
updateProject();