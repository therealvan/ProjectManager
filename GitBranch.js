const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { PROJECT_DIR } = require('./GitHub.js');

function getCurrentBranch() {
    try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { 
            encoding: 'utf8', 
            cwd: PROJECT_DIR 
        }).trim();
        console.log('Current branch: ' + branch);
        return branch;
    } catch (error) {
        console.error('Error getting current branch:', error.message);
        throw error;
    }
}

function saveCurrentBranch() {
    try {
        const branch = getCurrentBranch();
        fs.writeFileSync(path.join(PROJECT_DIR, 'Branche.git'), branch);
        console.log('Active branch (' + branch + ') written to Branche.git');
        return branch;
    } catch (error) {
        console.error('Error saving branch:', error.message);
        throw error;
    }
}

function createBranch(branchName) {
    try {
        execSync('git branch ' + branchName, { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Branch ' + branchName + ' created');
        return true;
    } catch (error) {
        console.error('Error creating branch ' + branchName + ':', error.message);
        throw error;
    }
}

function switchBranch(branchName) {
    try {
        execSync('git checkout ' + branchName, { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Switched to branch ' + branchName);
        saveCurrentBranch();
        return true;
    } catch (error) {
        console.error('Error switching to branch ' + branchName + ':', error.message);
        throw error;
    }
}

module.exports = { getCurrentBranch, saveCurrentBranch, createBranch, switchBranch };