const path = require('path');
const { addFiles, commitChanges, pushChanges } = require(path.join(__dirname, 'src/GitHub/GitHub.js'));

// Fonction principale pour mettre à jour le projet
function updateProject() {
    // Ajoute tous les fichiers locaux
    addFiles('.');
    
    // Crée un commit avec --allow-empty
    commitChanges('Push du dépôt local', true);
    
    // Pousse les modifications vers le dépôt distant
    pushChanges();
    
    console.log('Dépôt local poussé avec succès.');
}

// Exécute la mise à jour
updateProject();