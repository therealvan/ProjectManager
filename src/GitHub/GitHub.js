// GitHub.js - Module pour interagir avec GitHub
const { execSync } = require('child_process');
const fs = require('fs');

function cloneOrUpdateRepo(repoUrl, branch = 'main') {
    try {
        if (!fs.existsSync('.git')) {
            console.log('Clonage du dépôt à la racine...');
            execSync(`git clone -b ${branch} ${repoUrl} .`, { stdio: 'inherit' });
            console.log('Dépôt cloné avec succès à la racine.');
        } else {
            console.log('Mise à jour du dépôt à la racine...');
            execSync('git fetch origin', { stdio: 'inherit' });
            execSync('git add .', { stdio: 'inherit' });
            execSync('git commit -m "Sauvegarde automatique avant changement de branche" --allow-empty', { stdio: 'inherit' });
            execSync(`git checkout ${branch}`, { stdio: 'inherit' });
            execSync(`git pull origin ${branch}`, { stdio: 'inherit' });
            console.log('Dépôt mis à jour avec succès à la racine.');
        }
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du clonage ou de la mise à jour du dépôt : " + error.message);
        throw error;
    }
}

function pushLocalChanges(branch = 'main') {
    try {
        console.log('Ajout des modifications locales...');
        execSync('git add .', { stdio: 'inherit' });
        console.log('Création du commit...');
        execSync('git commit -m "Push des modifications locales" --allow-empty', { stdio: 'inherit' });
        console.log('Pousse vers le dépôt distant...');
        execSync(`git push origin ${branch}`, { stdio: 'inherit' });
        console.log('Modifications poussées avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du push des modifications : " + error.message);
        throw error;
    }
}

function listLocalFiles() {
    try {
        const files = fs.readdirSync('.', { withFileTypes: true });
        const fileList = files.map(item => item.isDirectory() ? item.name + '/' : item.name);
        console.log('Fichiers locaux après téléchargement :', fileList);
        return fileList;
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la liste des fichiers locaux : " + error.message);
        throw error;
    }
}

module.exports = { cloneOrUpdateRepo, pushLocalChanges, listLocalFiles };
