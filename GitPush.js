const { execSync } = require('child_process');
const { PROJECT_DIR, REPO_URL } = require('./GitHub.js');
const { getCurrentBranch } = require('./GitBranch.js');
const { logMessage } = require('./GitLog.js');

function push(branch = getCurrentBranch(), force = false) {
    try {
        const forceFlag = force ? ' --force' : '';
        execSync('git push origin ' + branch + forceFlag, { stdio: 'inherit', cwd: PROJECT_DIR });
        logMessage('Pushed to ' + branch + (force ? ' (forced)' : ''), 'success');
        return true;
    } catch (error) {
        logMessage('Error pushing: ' + error.message, 'error');
        throw error;
    }
}

module.exports = { push };