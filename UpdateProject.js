// UpdateProject.js
const path = require('path');
const { pushChanges } = require(path.join(__dirname, 'src', 'GitHub', 'GitHub.js'));

// Push local changes to V1.2.0 branch
pushChanges();
console.log('Pushed local changes to branch V1.2.0');