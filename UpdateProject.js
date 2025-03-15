// UpdateProject.js
const { pushChanges } = require('./src/GitHub/GitHub.js');

// Function to push local changes to the repository
function pushToRepo() {
    console.log('Pushing local changes to GitHub repository...');
    pushChanges();
    console.log('Push completed.');
}

// Execute the push
pushToRepo();