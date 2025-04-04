const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');

function resetHard() {
    try {
        execSync('git reset --hard', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Repository reset to last commit');
        return true;
    } catch (error) {
        console.error('Error resetting:', error.message);
        throw error;
    }
}

function clean() {
    try {
        execSync('git clean -fd', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Untracked files and directories removed');
        return true;
    } catch (error) {
        console.error('Error cleaning:', error.message);
        throw error;
    }
}

module.exports = { resetHard, clean };