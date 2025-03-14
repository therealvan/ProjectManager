const { execSync } = require('child_process');
const fs = require('fs');

function getCurrentBranch() {
    if (fs.existsSync('Branche.git')) {
        return fs.readFileSync('Branche.git', 'utf8').trim();
    } else {
        throw new Error('Fichier Branche.git introuvable');
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
