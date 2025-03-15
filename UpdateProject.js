// UpdateProject.js
const { pushChanges } = require('./src/GitHub/GitHub.js');

function updateProject() {
    // Push local changes to the remote repository
    pushChanges();
}

updateProject();