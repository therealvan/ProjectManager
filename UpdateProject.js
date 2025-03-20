// UpdateProject.js
const fs = require('fs');
const path = require('path');
const { pushChanges } = require('./src/GitHub/GitHub.js');

// Function to push changes to V1.2.0 branch
function pushToV120() {
    pushChanges(); // Utilise la fonction existante de GitHub.js qui pousse sur la branche courante (V1.2.0)
    fs.writeFileSync('project.log', `Pushed changes to V1.2.0 branch on ${new Date().toLocaleString()}\n`, { flag: 'a' });
}

// Execute the push
pushToV120();