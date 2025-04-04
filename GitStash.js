const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');

function stash() {
    try {
        execSync('git stash', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Changes stashed');
        return true;
    } catch (error) {
        console.error('Error stashing:', error.message);
        throw error;
    }
}

function stashPop() {
    try {
        execSync('git stash pop', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Stash applied');
        return true;
    } catch (error) {
        console.error('Error popping stash:', error.message);
        throw error;
    }
}

module.exports = { stash, stashPop };