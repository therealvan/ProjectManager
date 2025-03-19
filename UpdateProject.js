// UpdateProject.js
// Pushes local repository to GitHub branch V1.2.0
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Import GitHub utilities
const github = require('./src/GitHub/GitHub.js');

// Project directory and log file
const PROJECT_DIR = __dirname;
const LOG_FILE = path.join(PROJECT_DIR, 'project.log');

// Log function to redirect to project.log
const logStream = fs.createWriteStream(LOG_FILE, { flags: 'a' });
const log = (message) => {
    const timestamp = new Date().toISOString();
    logStream.write(`[${timestamp}] ${message}\n`);
    console.log(message);
};

function pushToV120() {
    try {
        log('Starting push to V1.2.0...');
        
        // Ensure Git is initialized
        if (!fs.existsSync(path.join(PROJECT_DIR, '.git'))) {
            execSync('git init', { cwd: PROJECT_DIR });
            log('Git repository initialized.');
        }

        // Add all files
        execSync('git add .', { cwd: PROJECT_DIR });
        log('All files staged.');

        // Commit changes
        execSync('git commit -m "Update to V1.2.0"', { cwd: PROJECT_DIR });
        log('Changes committed.');

        // Set remote if not already set
        const remoteUrl = 'https://github.com/therealvan/ProjectManager.git';
        try {
            execSync('git remote -v', { cwd: PROJECT_DIR });
        } catch {
            execSync(`git remote add origin ${remoteUrl}`, { cwd: PROJECT_DIR });
            log('Remote origin set.');
        }

        // Push to branch V1.2.0
        execSync('git push origin V1.2.0 --force', { cwd: PROJECT_DIR });
        log('Pushed to V1.2.0 successfully.');
    } catch (error) {
        log(`Error during push: ${error.message}`);
        throw error;
    } finally {
        logStream.end();
    }
}

// Execute the push
pushToV120();