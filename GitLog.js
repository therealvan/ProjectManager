const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');

function log() {
    try {
        execSync('git log --oneline', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Commit history displayed');
        return true;
    } catch (error) {
        console.error('Error displaying log:', error.message);
        throw error;
    }
}

module.exports = { log };