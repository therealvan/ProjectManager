// UpdateProject.js
const { addFiles, commitChanges, pushChanges } = require('./src/GitHub/GitHub.js');

// Add all files to staging
addFiles('.');

// Commit the changes
commitChanges('Push local repo to GitHub');

// Push to GitHub
pushChanges();

console.log('Local repository pushed to GitHub successfully');