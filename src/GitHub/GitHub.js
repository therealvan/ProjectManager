// GitHub.js - Module pour interagir avec GitHub
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function pushChanges(message) {
    try {
        execSync('git add .', { stdio: 'inherit' });
        execSync(`git commit --allow-empty -m "${message}"`, { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });
        console.log('Changements poussés avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du push : " + error.message);
        throw error;
    }
}

function listRemoteFiles() {
    try {
        const files = execSync('git ls-tree -r origin/main src/GitHub', { encoding: 'utf8' });
        console.log('Fichiers sur GitHub :', files);
        return files;
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la vérification des fichiers : " + error.message);
        throw error;
    }
}

module.exports = { pushChanges, listRemoteFiles };
