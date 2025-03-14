
const { execSync } = require('child_process');

function addFiles(files = '.') {
    try {
        execSync(`git add ${files}`, { stdio: 'inherit' });
        console.log('Fichiers ajoutés avec succès.');
    } catch (error) {
        console.error('Erreur lors de l’ajout des fichiers :', error.message);
        throw error;
    }
}

function commitChanges(message, allowEmpty = false) {
    try {
        execSync(`git commit ${allowEmpty ? '--allow-empty ' : ''}-m "${message}"`, { stdio: 'inherit' });
        console.log('Commit créé avec succès.');
    } catch (error) {
        console.error('Erreur lors du commit :', error.message);
        throw error;
    }
}

function pushChanges() {
    try {
        execSync('git push', { stdio: 'inherit' });
        console.log('Push effectué avec succès.');
    } catch (error) {
        console.error('Erreur lors du push :', error.message);
        throw error;
    }
}

module.exports = { addFiles, commitChanges, pushChanges };
    