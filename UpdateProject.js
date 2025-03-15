// UpdateProject.js
const { pushChanges } = require('./src/GitHub/GitHub.js');

// Push the project changes to GitHub
function updateAndPush() {
    console.log('Pushing project changes to GitHub...');
    pushChanges();
    console.log('Push completed.');
}

// Execute the push
updateAndPush();

module.exports = { updateAndPush };