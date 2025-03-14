const { getCurrentBranch, addFiles, commitChanges, pushChanges } = require('./src/GitHub/GitHub.js');
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

    console.log('Ajout des fichiers locaux...');
    addFiles(['.']); // Ajoute tout le dossier courant
    
    console.log('Création du commit...');
    commitChanges('Push local vers GitHub via UpdateProject.js');
    
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