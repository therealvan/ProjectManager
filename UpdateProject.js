const fs = require('fs');

function updateProject() {
    console.log('Lancement de UpdateProject.js...');
    
    // Redirection des sorties vers project.log
    const logStream = fs.createWriteStream('project.log', { flags: 'a' });
    const originalConsoleLog = console.log;
    console.log = (...args) => {
        logStream.write(args.join(' ') + '\n');
        originalConsoleLog(...args);
    };

    // Vider le cache du module GitHub.js pour garantir le chargement de la version mise à jour
    delete require.cache[require.resolve('./src/GitHub/GitHub.js')];
    console.log('Cache de GitHub.js vidé.');

    // Chargement du module mis à jour
    const { getCurrentBranch, addFiles, commitChanges, pushChanges } = require('./src/GitHub/GitHub.js');

    console.log('Ajout des fichiers locaux...');
    addFiles('.');
    
    console.log('Création du commit...');
    commitChanges('Push local vers GitHub');
    
    console.log('Push vers GitHub...');
    const branch = getCurrentBranch();
    pushChanges(branch);
    
    console.log('UpdateProject.js terminé.');
    
    // Restauration de la console
    logStream.end();
    console.log = originalConsoleLog;
}

updateProject();

module.exports = { updateProject };