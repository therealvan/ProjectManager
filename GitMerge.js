const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');

function merge(branchName) {
    try {
        execSync('git merge ' + branchName, { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Merged branch ' + branchName);
        return true;
    } catch (error) {
        console.error('Error merging branch ' + branchName + ':', error.message);
        throw error;
    }
}

module.exports = { merge };