const { listLocalFiles } = require('./src/GitHub/GitHub.js');
const { execSync } = require('child_process');
const path = require('path');

const PROJECT_DIR = path.join(__dirname);
const REPO_URL = 'https://github.com/therealvan/ProjectManager.git';

function updateProject() {
    console.log('Lancement de UpdateProject.js pour push vers le dépôt...');
    
    // Définit le répertoire de travail
    process.chdir(PROJECT_DIR);
    console.log('Répertoire de travail :', process.cwd());

    // Ajoute tous les fichiers locaux
    execSync('git add .', { stdio: 'inherit' });
    console.log('Fichiers ajoutés à Git.');

    // Crée un commit
    execSync('git commit -m "Push depuis UpdateProject.js" --allow-empty', { stdio: 'inherit' });
    console.log('Commit créé avec succès.');

    // Pousse vers le dépôt distant
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('Modifications poussées vers', REPO_URL);

    // Vérifie les fichiers locaux après le push
    listLocalFiles();

    console.log('Push terminé avec succès.');
}

updateProject();

module.exports = { updateProject };