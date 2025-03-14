// GitHub.js - Module pour interagir avec GitHub
const { execSync } = require('child_process');
const fs = require('fs');

function cloneOrUpdateRepo(repoUrl, branch = 'V1.0.0') {
    try {
        if (!fs.existsSync('.git')) {
            console.log('Clonage du dépôt à la racine...');
            execSync(`git clone -b ${branch} ${repoUrl} .`, { stdio: 'inherit' });
            console.log('Dépôt cloné avec succès à la racine.');
        } else {
            console.log('Mise à jour du dépôt à la racine...');
            execSync('git fetch origin', { stdio: 'inherit' });
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

function addFiles(pattern) {
    try {
        execSync(`git add ${pattern}`, { stdio: 'inherit' });
        console.log('Fichiers ajoutés à l’index.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de l’ajout des fichiers : " + error.message);
        throw error;
    }
}

function commitChanges(message) {
    try {
        execSync(`git commit -m "${message}" --allow-empty`, { stdio: 'inherit' });
        console.log('Commit créé avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du commit : " + error.message);
        throw error;
    }
}

function pushChanges(branch) {
    try {
        execSync(`git push origin ${branch}`, { stdio: 'inherit' });
        console.log('Modifications poussées avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du push : " + error.message);
        throw error;
    }
}

function pullChanges(branch) {
    try {
        execSync(`git pull origin ${branch}`, { stdio: 'inherit' });
        console.log('Modifications tirées avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du pull : " + error.message);
        throw error;
    }
}

function createBranch(branchName) {
    try {
        execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
        execSync(`git push origin ${branchName}`, { stdio: 'inherit' });
        console.log('Branche ${branchName} créée et poussée avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la création de la branche : " + error.message);
        throw error;
    }
}

function createRelease(version, message) {
    try {
        execSync(`git tag ${version}`, { stdio: 'inherit' });
        execSync(`git push origin ${version}`, { stdio: 'inherit' });
        console.log('Release ${version} créée avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la création de la release : " + error.message);
        throw error;
    }
}

function checkoutBranch(branch) {
    try {
        execSync(`git checkout ${branch}`, { stdio: 'inherit' });
        console.log('Branche ${branch} checkout avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du checkout : " + error.message);
        throw error;
    }
}

function mergeBranch(sourceBranch, targetBranch) {
    try {
        execSync(`git checkout ${targetBranch}`, { stdio: 'inherit' });
        execSync(`git merge ${sourceBranch}`, { stdio: 'inherit' });
        execSync(`git push origin ${targetBranch}`, { stdio: 'inherit' });
        console.log('Fusion de ${sourceBranch} dans ${targetBranch} réussie.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la fusion : " + error.message);
        throw error;
    }
}

function deleteBranch(branch, remote = false) {
    try {
        if (remote) {
            execSync(`git push origin --delete ${branch}`, { stdio: 'inherit' });
            console.log('Branche distante ${branch} supprimée.');
        } else {
            execSync(`git branch -D ${branch}`, { stdio: 'inherit' });
            console.log('Branche locale ${branch} supprimée.');
        }
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la suppression de la branche : " + error.message);
        throw error;
    }
}

function status() {
    try {
        const statusOutput = execSync('git status', { encoding: 'utf8' });
        console.log('État du dépôt :', statusOutput);
        return statusOutput;
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la vérification de l’état : " + error.message);
        throw error;
    }
}

function fetchRepo() {
    try {
        execSync('git fetch origin', { stdio: 'inherit' });
        console.log('Dépôt fetch avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du fetch : " + error.message);
        throw error;
    }
}

module.exports = { cloneOrUpdateRepo, listLocalFiles, addFiles, commitChanges, pushChanges, pullChanges, createBranch, createRelease, checkoutBranch, mergeBranch, deleteBranch, status, fetchRepo };
