// UpdateProject.js
// Purpose: Push changes to GitHub repository

const github = require('./src/GitHub/GitHub.js');

function updateProject() {
    // Push changes to the remote repository
    github.pushChanges();
    console.log('Code pushed to GitHub');
}

// Execute the push
updateProject();