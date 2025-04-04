const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');

function createTag(tagName) {
    try {
        execSync('git tag ' + tagName, { stdio: 'inherit', cwd: PROJECT_DIR });
        execSync('git push origin ' + tagName, { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Tag ' + tagName + ' created and pushed');
        return true;
    } catch (error) {
        console.error('Error creating tag:', error.message);
        throw error;
    }
}

module.exports = { createTag };