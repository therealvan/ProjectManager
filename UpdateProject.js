const path = require('path');
const { addFiles, commitChanges, pushChanges } = require(path.join(__dirname, 'src/GitHub/GitHub.js'));

// Fonction principale pour mettre à jour le projet
function updateProject() {
    // Ajoute tous les fichiers locaux avec un argument clair
    addFiles('.'); // '.' pour ajouter tous les fichiers dans le répertoire courant
    
    // Crée un commit avec --allow-empty
    commitChanges('Mise à jour du projet local', true);
    
    // Pousse les modifications vers le dépôt distant
    pushChanges();
    
    console.log('Modifications poussées vers le dépôt distant.');
}

// Exécute la mise à jour
updateProject();