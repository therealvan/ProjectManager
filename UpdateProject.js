const { cloneOrUpdateRepo, addFiles, commitChanges, pushChanges } = require('./src/GitHub/GitHub.js');

function updateProject() {
    console.log('Lancement de UpdateProject.js...');
    
    // Ajoute tous les fichiers locaux
    addFiles('.');
    console.log('Fichiers ajoutés.');
    
    // Commit les changements
    commitChanges('Mise à jour depuis UpdateProject.js');
    console.log('Changements commités.');
    
    // Pousse vers la branche V1.0.0
    pushChanges('V1.0.0');
    console.log('Changements poussés vers GitHub sur la branche V1.0.0.');
    
    console.log('UpdateProject.js terminé.');
}

updateProject();

module.exports = { updateProject };