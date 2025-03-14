const path = require('path');
const { addFiles, commitChanges, pushChanges } = require(path.join(__dirname, 'src/GitHub/GitHub.js'));

// Fonction principale pour mettre à jour le projet
function updateProject() {
    try {
        // Ajoute tous les fichiers locaux avec un argument explicite
        addFiles('.'); // '.' pour ajouter tous les fichiers du répertoire courant
        
        // Crée un commit avec --allow-empty
        commitChanges('Mise à jour du projet local', true);
        
        // Pousse les modifications vers le dépôt distant
        pushChanges();
        
        console.log('Modifications poussées vers le dépôt distant.');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du projet :', error.message);
        throw error; // Relance l'erreur pour un diagnostic clair
    }
}

// Exécute la mise à jour
updateProject();