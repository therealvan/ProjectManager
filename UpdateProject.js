const { pushChanges } = require('./src/GitHub/GitHub.js');

function updateProject() {
    console.log('Lancement de UpdateProject.js...');
    pushChanges();
    console.log('Code poussé vers le dépôt avec succès.');
}

updateProject();