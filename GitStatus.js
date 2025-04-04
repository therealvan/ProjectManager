const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');

function status() {
    try {
        execSync('git status', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Repository status displayed');
        return true;
    } catch (error) {
        console.error('Error checking status:', error.message);
        throw error;
    }
}

module.exports = { status };