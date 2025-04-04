const { execSync } = require('child_process');

function checkGit() {
    try {
        console.log('Checking Git...');
        execSync('git --version', { stdio: 'inherit' });
        console.log('Git OK.');
        return true;
    } catch (error) {
        console.error('Error - Git is not installed or inaccessible:', error.message);
        console.log('Please install Git manually or via npm.');
        return false;
    }
}

module.exports = { checkGit };