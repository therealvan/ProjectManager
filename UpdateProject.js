const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function updateProject() {
    console.log('Mise à jour du projet...');
    
    // Ajoute tous les fichiers
    execSync('git add .', { stdio: 'inherit' });
    
    // Commit avec --allow-empty
    execSync('git commit -m "Mise à jour du projet" --allow-empty', { stdio: 'inherit' });
    
    // Push vers le dépôt
    execSync('git push', { stdio: 'inherit' });
    
    // Vérifie si le fichier UpdateProject.js existe dans le dépôt
    const repoDir = path.join(__dirname, '.git');
    if (fs.existsSync(repoDir)) {
        const files = execSync('git ls-files', { encoding: 'utf-8' });
        if (files.includes('UpdateProject.js')) {
            console.log('Vérification : UpdateProject.js bien poussé dans le dépôt.');
        } else {
            console.error('Erreur : UpdateProject.js n’a pas été trouvé dans le dépôt.');
        }
    } else {
        console.error('Erreur : Dépôt Git non trouvé.');
    }
    
    console.log('Projet mis à jour avec succès !');
}

updateProject();