const { startProject } = require('./StartProject.js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function updateProject() {
    console.log('Lancement de UpdateProject.js...');

    // Vérifie et crée/modifie le fichier .gitignore
    const gitignorePath = path.join(__dirname, '.gitignore');
    const ignoreContent = 'StartProject.js\nUpdateProject.js\n';
    if (!fs.existsSync(gitignorePath)) {
        fs.writeFileSync(gitignorePath, ignoreContent);
        console.log('.gitignore créé avec StartProject.js et UpdateProject.js ignorés.');
    } else {
        const currentContent = fs.readFileSync(gitignorePath, 'utf8');
        if (!currentContent.includes('StartProject.js') || !currentContent.includes('UpdateProject.js')) {
            fs.appendFileSync(gitignorePath, ignoreContent);
            console.log('.gitignore mis à jour pour ignorer StartProject.js et UpdateProject.js.');
        } else {
            console.log('.gitignore déjà configuré pour ignorer StartProject.js et UpdateProject.js.');
        }
    }

    // Ajoute .gitignore au suivi Git et pousse les modifications
    execSync('git add .gitignore', { stdio: 'inherit' });
    execSync('git commit -m "Ajout de .gitignore pour ignorer StartProject.js et UpdateProject.js" --allow-empty', { stdio: 'inherit' });
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('Modifications de .gitignore poussées vers le dépôt.');

    // Lance StartProject.js
    startProject().catch(err => console.error('Erreur lors de l’exécution de StartProject.js :', err.message));
    console.log('UpdateProject.js terminé.');
}

updateProject();

module.exports = { updateProject };