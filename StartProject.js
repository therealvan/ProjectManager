const { execSync } = require('child_process');
const { addFiles, commit } = require('./GitCommit.js');
const { push } = require('./GitPush.js');
const { switchBranch } = require('./GitBranch.js');
const { REPO_URL } = require('./GitHub.js');

function startProject() {
    console.log('Starting StartProject.js...');
    console.log('-------------');

    try {
        // Initialiser le repository Git si ce n'est pas déjà fait
        console.log('Initializing Git repository if not already done...');
        try {
            execSync('git init', { stdio: 'inherit' });
            console.log('Git repository initialized');
        } catch (error) {
            console.log('Repository already initialized or error ignored');
        }
        console.log('-------------');

        // Configurer le remote si ce n'est pas déjà fait
        console.log('Setting up remote repository...');
        try {
            execSync(`git remote add origin ${REPO_URL}`, { stdio: 'inherit' });
            console.log('Remote origin set to', REPO_URL);
        } catch (error) {
            console.log('Remote already set or error ignored');
        }
        console.log('-------------');

        // Vérifier s'il y a des commits, sinon en créer un initial
        console.log('Checking for initial commit...');
        try {
            execSync('git rev-parse HEAD', { stdio: 'pipe' });
            console.log('Commits already exist');
        } catch (error) {
            console.log('No commits found, creating initial commit...');
            // Ajouter un fichier temporaire si le répertoire est vide
            const fs = require('fs');
            fs.writeFileSync('README.md', '# Initial commit');
            addFiles('.');
            commit('Initial commit');
            console.log('Initial commit created');
        }
        console.log('-------------');

        // Basculer sur la branche V1.0.0 ou la créer si elle n'existe pas
        console.log('Switching to or creating branch V1.0.0...');
        try {
            switchBranch('V1.0.0');
        } catch (error) {
            console.log('Branch V1.0.0 does not exist, creating it...');
            execSync('git branch V1.0.0', { stdio: 'inherit' });
            switchBranch('V1.0.0');
        }
        console.log('-------------');

        // Ajouter tous les fichiers locaux au staging
        console.log('Adding all local files...');
        addFiles('.');
        console.log('-------------');

        // Committer les changements
        console.log('Committing changes...');
        commit('Update from local to V1.0.0');
        console.log('-------------');

        // Pousser sur la branche V1.0.0
        console.log('Pushing to V1.0.0...');
        push('V1.0.0');
        console.log('-------------');

        console.log('Push to V1.0.0 completed successfully!');
    } catch (error) {
        console.error('Error during push process:', error.message);
    }
}

try {
    startProject();
} catch (error) {
    console.error('Global error in StartProject.js:', error.message);
}

module.exports = { startProject };