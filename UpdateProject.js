// UpdateProject.js
const { addFiles, commitChanges, pushChanges } = require('./src/GitHub/GitHub.js');
const fs = require('fs');

// Add all local files, commit, and push to the repository
addFiles('.');
commitChanges('Update from local to remote');
pushChanges();

// Log actions to project.log
fs.appendFileSync('project.log', 'Pushed local changes to remote at ' + new Date().toISOString() + '\n');