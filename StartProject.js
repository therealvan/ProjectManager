const { initDependencies } = require('./GitInit.js');

function startProject() {
    // Initialiser les dépendances en premier
    try {
        initDependencies();
    } catch (error) {
        console.error('Failed to initialize dependencies:', error.message);
        return;
    }

    // Importer les modules après l'initialisation
    const { switchBranch } = require('./GitBranch.js');
    const { addFiles, commit } = require('./GitCommit.js');
    const { push } = require('./GitPush.js');
    const { logMessage, logProgress } = require('./GitLog.js');

    const progressBar = logProgress('Pushing code to V1.0.0', 4); // 4 étapes

    try {
        logMessage('Starting StartProject.js...', 'info');
        progressBar.tick();

        // Basculer sur V1.0.0
        logMessage('Switching to branch V1.0.0...', 'info');
        switchBranch('V1.0.0');
        progressBar.tick();

        // Ajouter tous les fichiers locaux
        logMessage('Adding all local files...', 'info');
        addFiles('.');
        progressBar.tick();

        // Committer les changements
        logMessage('Committing changes...', 'info');
        const committed = commit('Update from local to V1.0.0');
        if (!committed) {
            logMessage('No changes to commit, proceeding to push...', 'warning');
        }
        progressBar.tick();

        // Pousser sur V1.0.0 avec force
        logMessage('Pushing to V1.0.0 with force...', 'info');
        push('V1.0.0', true);
        logMessage('Push to V1.0.0 completed successfully!', 'success');
    } catch (error) {
        logMessage('Error during push process: ' + error.message, 'error');
    }
}

startProject();
module.exports = { startProject };