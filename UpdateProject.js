const { addFiles, commitChanges, pushChanges, createBranch, checkoutBranch, getCurrentBranch } = require('./src/GitHub/GitHub.js');

function updateProject() {
    try {
        // Vérifier la branche actuelle
        const currentBranch = getCurrentBranch();
        if (currentBranch !== 'V1.3.0') {
            // Créer la branche V1.3.0 si elle n'existe pas encore
            try {
                createBranch('V1.3.0');
                console.log('Branche V1.3.0 créée');
            } catch (e) {
                console.log('Branche V1.3.0 existe déjà ou création non nécessaire');
            }
            // Basculer sur V1.3.0
            checkoutBranch('V1.3.0');
            console.log('Basculé sur la branche V1.3.0');
        } else {
            console.log('Déjà sur la branche V1.3.0');
        }

        // Ajouter tous les fichiers modifiés
        addFiles('.');
        console.log('Fichiers ajoutés à l’index');

        // Committer les changements
        commitChanges('Mise à jour vers V1.3.0 avec SimCity initial');
        console.log('Changements commités sur V1.3.0');

        // Pousser la branche vers le dépôt distant
        pushChanges();
        console.log('Branche V1.3.0 poussée vers GitHub');
    } catch (error) {
        console.error('Erreur lors de la mise à jour :', error.message);
    }
}

updateProject();
module.exports = { updateProject };