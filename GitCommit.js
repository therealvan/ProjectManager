const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');

function addFiles(files = '.') {
    try {
        execSync('git add ' + files, { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Files added to staging: ' + files);
        return true;
    } catch (error) {
        console.error('Error adding files:', error.message);
        throw error;
    }
}

function commit(message = 'Update') {
    try {
        execSync('git commit -m "' + message + '"', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Committed with message: "' + message + '"');
        return true;
    } catch (error) {
        if (error.message.includes('nothing to commit')) {
            console.log('Nothing to commit, working tree clean');
            return false; // Pas d'erreur, juste rien à committer
        }
        console.error('Error committing:', error.message);
        throw error;
    }
}

module.exports = { addFiles, commit };