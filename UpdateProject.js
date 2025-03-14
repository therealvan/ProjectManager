const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function updateProject() {
    console.log('Mise à jour du projet via UpdateProject.js...');
    
    // Chemin vers Fonctions.js
    const fonctionsPath = path.join(__dirname, 'Fonctions.js');
    
    // Nouveau contenu pour Fonctions.js (inchangé)
    const newFonctionsContent = `
function main() {
    console.log('Fonctions.js exécuté avec succès');
}

module.exports = { main };
    `;
    
    // Écriture du nouveau contenu dans Fonctions.js
    fs.writeFileSync(fonctionsPath, newFonctionsContent.trim());
    console.log('Fonctions.js modifié avec succès');
    
    // Gestion Git pour pousser les modifications
    try {
        console.log('Préparation du push vers Git...');
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "Modification de Fonctions.js via UpdateProject.js" --allow-empty', { stdio: 'inherit' });
        execSync('git push', { stdio: 'inherit' });
        console.log('Code poussé avec succès vers le dépôt Git.');
        
        // Vérification que le fichier est bien dans le dépôt
        const gitLsFiles = execSync('git ls-files', { encoding: 'utf8' });
        if (gitLsFiles.includes('Fonctions.js')) {
            console.log('Vérification : Fonctions.js bien présent dans le dépôt.');
        } else {
            console.error('Erreur : Fonctions.js non détecté dans le dépôt.');
        }
    } catch (error) {
        console.error('Erreur lors du push Git :', error.message);
    }
}

updateProject();