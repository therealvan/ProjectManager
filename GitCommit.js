const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');
const { logMessage } = require('./GitLog.js');

function addFiles(files = '.') {
    try {
        execSync('git add ' + files, { stdio: 'inherit', cwd: PROJECT_DIR });
        logMessage('Files added to staging: ' + files, 'success');
        return true;
    } catch (error) {
        logMessage('Error adding files: ' + error.message, 'error');
        throw error;
    }
}

function commit(message = 'Update') {
    try {
        execSync('git commit -m "' + message + '"', { stdio: 'inherit', cwd: PROJECT_DIR });
        logMessage('Committed with message: "' + message + '"', 'success');
        return true;
    } catch (error) {
        if (error.message.includes('nothing to commit')) {
            logMessage('Nothing to commit, working tree clean', 'warning');
            return false; // Pas d'erreur, juste rien à committer
        }
        logMessage('Error committing: ' + error.message, 'error');
        throw error;
    }
}

module.exports = { addFiles, commit };