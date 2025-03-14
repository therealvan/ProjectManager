
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getCurrentBranch() {
    try {
        return fs.readFileSync(path.join(__dirname, '../../Branche.git'), 'utf8').trim();
    } catch (error) {
        console.error('Erreur lors de la lecture de Branche.git :', error.message);
        return 'main'; // Branche par défaut si erreur
    }
}

function addFiles(files) {
    execSync('git add ' + files, { stdio: 'inherit' });
    console.log('Fichiers ajoutés à l’index.');
}

function commitChanges(message) {
    execSync('git commit -m "' + message + '"', { stdio: 'inherit' });
    console.log('Commit créé avec succès.');
}

function pushChanges() {
    const branch = getCurrentBranch();
    console.log('Pousse vers la branche :', branch);
    execSync('git push origin ' + branch, { stdio: 'inherit' });
}

module.exports = { addFiles, commitChanges, pushChanges };
    