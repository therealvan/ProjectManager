const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');
const { getCurrentBranch } = require('./GitBranch.js');

function pull(branch = getCurrentBranch()) {
    try {
        execSync('git pull origin ' + branch, { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Pulled from ' + branch);
        return true;
    } catch (error) {
        console.error('Error pulling:', error.message);
        throw error;
    }
}

module.exports = { pull };