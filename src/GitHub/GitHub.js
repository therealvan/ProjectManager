const { execSync } = require('child_process');
const fs = require('fs');

function getCurrentBranch() {
    try {
        if (fs.existsSync('Branche.git')) {
            return fs.readFileSync('Branche.git', 'utf8').trim();
        }
        return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    } catch (error) {
        console.error('Erreur lors de la récupération de la branche :', error.message);
        return 'V1.0.0'; // Branche par défaut
    }
}

function addFiles(files) {
    execSync(`git add ${files.join(' ')}`, { stdio: 'inherit' });
    console.log('Fichiers ajoutés à l’index.');
}

function commitChanges(message) {
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
    console.log('Commit créé avec succès.');
}

function pushChanges(branch) {
    execSync(`git push origin ${branch}`, { stdio: 'inherit' });
    console.log('Push effectué avec succès.');
}

module.exports = { getCurrentBranch, addFiles, commitChanges, pushChanges };
