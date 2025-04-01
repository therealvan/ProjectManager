// UpdateProject.js
const fs = require('fs');
const path = require('path');
const { pushChanges } = require('./src/GitHub/GitHub.js');

const PROJECT_DIR = path.join(__dirname);

// Logger function
function log(message) {
    fs.appendFileSync('project.log', `${new Date().toISOString()} - ${message}\n`);
}

// Main function to push local changes
function updateProject() {
    if (!fs.existsSync(path.join(PROJECT_DIR, 'src/GitHub/GitHub.js'))) {
        log('Error: GitHub.js not found');
        throw new Error('GitHub.js not found');
    }

    pushChanges();
    log('Local changes pushed to repository');
}

// Execute
try {
    updateProject();
} catch (error) {
    log(`Execution failed: ${error.message}`);
    throw error;
}