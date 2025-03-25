const { addFiles, commitChanges, pushChanges } = require('./src/GitHub/GitHub.js');

function updateProject() {
    // Add all local files to staging
    addFiles('.');

    // Commit changes with a message
    commitChanges('Mise à jour locale vers le dépôt GitHub');

    // Push changes to the remote repository
    pushChanges();
}

updateProject();
module.exports = { updateProject };