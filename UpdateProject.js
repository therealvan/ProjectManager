const { pushChanges } = require('./src/GitHub/GitHub.js');

function updateProject() {
    console.log('Starting UpdateProject.js...');
    pushChanges();
    console.log('Local code successfully pushed to the repository.');
}

updateProject();