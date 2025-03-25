const { addFiles, commitChanges, pushChanges } = require('./src/GitHub/GitHub.js');

function updateProject() {
    // Add all local files to the staging area
    addFiles('.');

    // Commit the changes with a message
    commitChanges('Mise à jour du projet depuis local');

    // Push changes to the remote repository
    pushChanges();
}

updateProject();
module.exports = { updateProject };