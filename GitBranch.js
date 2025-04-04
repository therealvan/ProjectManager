const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { PROJECT_DIR } = require('./GitHub.js');
const { logMessage } = require('./GitLog.js');

function getCurrentBranch() {
    try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { 
            encoding: 'utf8', 
            cwd: PROJECT_DIR 
        }).trim();
        logMessage('Current branch: ' + branch, 'info');
        return branch;
    } catch (error) {
        logMessage('Error getting current branch: ' + error.message, 'error');
        throw error;
    }
}

function saveCurrentBranch() {
    try {
        const branch = getCurrentBranch();
        fs.writeFileSync(path.join(PROJECT_DIR, 'Branche.git'), branch);
        logMessage('Active branch (' + branch + ') written to Branche.git', 'success');
        return branch;
    } catch (error) {
        logMessage('Error saving branch: ' + error.message, 'error');
        throw error;
    }
}

function createBranch(branchName) {
    try {
        try {
            execSync('git rev-parse HEAD', { stdio: 'pipe', cwd: PROJECT_DIR });
        } catch (error) {
            logMessage('No commits found, creating initial commit...', 'warning');
            fs.writeFileSync(path.join(PROJECT_DIR, 'README.md'), '# Initial commit');
            execSync('git add .', { stdio: 'inherit', cwd: PROJECT_DIR });
            execSync('git commit -m "Initial commit"', { stdio: 'inherit', cwd: PROJECT_DIR });
        }

        execSync('git branch ' + branchName, { stdio: 'inherit', cwd: PROJECT_DIR });
        logMessage('Branch ' + branchName + ' created', 'success');
        return true;
    } catch (error) {
        logMessage('Branch ' + branchName + ' may already exist or error ignored', 'warning');
        return false;
    }
}

function switchBranch(branchName) {
    try {
        try {
            execSync('git checkout ' + branchName, { stdio: 'inherit', cwd: PROJECT_DIR });
            logMessage('Switched to branch ' + branchName, 'success');
        } catch (error) {
            logMessage('Branch ' + branchName + ' does not exist, creating it...', 'warning');
            createBranch(branchName);
            execSync('git checkout ' + branchName, { stdio: 'inherit', cwd: PROJECT_DIR });
            logMessage('Switched to newly created branch ' + branchName, 'success');
        }
        saveCurrentBranch();
        return true;
    } catch (error) {
        logMessage('Error switching to branch ' + branchName + ': ' + error.message, 'error');
        throw error;
    }
}

module.exports = { getCurrentBranch, saveCurrentBranch, createBranch, switchBranch };