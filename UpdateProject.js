const { execSync } = require('child_process');
const path = require('path');

function updateProject() {
    console.log('Lancement de UpdateProject.js...');
    const PROJECT_DIR = path.join(__dirname);

    try {
        console.log('Ajout des fichiers locaux au suivi Git...');
        execSync('git add .', { cwd: PROJECT_DIR, stdio: 'inherit' });

        console.log('Création d’un commit...');
        execSync('git commit -m "Mise à jour du projet local" --allow-empty', { cwd: PROJECT_DIR, stdio: 'inherit' });

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