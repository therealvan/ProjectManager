const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');
const { getCurrentBranch } = require('./GitBranch.js');

function push(branch = getCurrentBranch(), force = false) {
    try {
        const forceFlag = force ? ' --force' : '';
        execSync('git push origin ' + branch + forceFlag, { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Pushed to ' + branch + (force ? ' (forced)' : ''));
        return true;
    } catch (error) {
        console.error('Error pushing:', error.message);
        throw error;
    }
}

module.exports = { push };