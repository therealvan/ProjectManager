const { switchBranch } = require('./GitBranch.js');
const { addFiles, commit } = require('./GitCommit.js');
const { push } = require('./GitPush.js');

function startProject() {
    console.log('Starting StartProject.js...');
    console.log('-------------');

    try {
        // Basculer sur V1.0.0 (créera la branche si nécessaire)
        console.log('Switching to branch V1.0.0...');
        switchBranch('V1.0.0');
        console.log('-------------');

        // Ajouter tous les fichiers locaux
        console.log('Adding all local files...');
        addFiles('.');
        console.log('-------------');

        // Committer les changements (si applicable)
        console.log('Committing changes...');
        const committed = commit('Update from local to V1.0.0');
        if (!committed) {
            console.log('No changes to commit, proceeding to push...');
        }
        console.log('-------------');

        // Pousser sur V1.0.0 avec force
        console.log('Pushing to V1.0.0 with force...');
        push('V1.0.0', true); // Force pour écraser le remote si nécessaire
        console.log('-------------');

        console.log('Push to V1.0.0 completed successfully!');
    } catch (error) {
        console.error('Error during push process:', error.message);
    }
}

startProject();
module.exports = { startProject };