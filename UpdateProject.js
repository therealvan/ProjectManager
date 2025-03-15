// UpdateProject.js
const fs = require('fs');
const path = require('path');
const github = require(path.join(__dirname, 'src', 'GitHub', 'GitHub.js'));

function updateProject() {
    // Create a new branch named "test"
    github.createBranch('test');
    
    // Push local changes to the "test" branch
    github.pushChanges();
}

// Execute the update process
updateProject();

module.exports = { updateProject };