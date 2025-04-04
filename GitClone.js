const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { PROJECT_DIR, REPO_URL } = require('./GitHub.js');

function cloneToRoot(branch = 'V1.0.0') {
    try {
        console.log('Starting cloning to root...');
        const tempDir = path.join(PROJECT_DIR, 'temp_repo');
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
        execSync('git clone -b ' + branch + ' ' + REPO_URL + ' ' + tempDir, { stdio: 'inherit' });
        const tempFiles = fs.readdirSync(tempDir);
        for (const file of tempFiles) {
            if (file !== '.git') {
                fs.renameSync(path.join(tempDir, file), path.join(PROJECT_DIR, file));
            }
        }
        fs.renameSync(path.join(tempDir, '.git'), path.join(PROJECT_DIR, '.git'));
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log('Repository successfully cloned to root on branch ' + branch + '.');
        return true;
    } catch (error) {
        console.error('Error during cloning:', error.message);
        throw error;
    }
}

module.exports = { cloneToRoot };