// UpdateProject.js
const { pushChanges } = require('./src/GitHub/GitHub.js');

// Function to push local code to GitHub
function updateProject() {
    console.log('Pushing local code to GitHub...');
    pushChanges();
}

updateProject();

module.exports = { updateProject };