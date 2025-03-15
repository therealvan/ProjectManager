const { pushChanges } = require('./src/GitHub/GitHub.js');

function updateProject() {
    console.log('Starting UpdateProject.js...');
    pushChanges();
    console.log('Local project successfully pushed to the repository.');
}

updateProject();