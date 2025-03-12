const { startProject } = require('./StartProject.js');

function updateProject() {
    console.log('Lancement de UpdateProject.js...');
    startProject();
    console.log('Projet mis à jour avec succès via StartProject.js.');
}

updateProject();

module.exports = { updateProject };