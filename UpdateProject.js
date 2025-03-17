// UpdateProject.js
const fs = require('fs');
const path = require('path');

const githubPath = path.join(__dirname, 'src', 'GitHub', 'GitHub.js');
const { pushChanges } = require(githubPath);

function updateProject() {
    pushChanges();
}

updateProject();