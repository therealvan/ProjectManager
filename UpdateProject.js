const fs = require('fs');
const path = require('path');

function updateProject() {
    console.log('Lancement de UpdateProject.js...');
    
    // Redirection des sorties vers project.log
    const logStream = fs.createWriteStream('project.log', { flags: 'a' });
    const originalConsoleLog = console.log;
    console.log = (...args) => {
        logStream.write(`${args.join(' ')}\n`);
        originalConsoleLog(...args);
    };

    // Chargement des modules depuis src/GitHub/
    const github = require(path.join(__dirname, 'src', 'GitHub', 'GitHub.js'));
    const diag = require(path.join(__dirname, 'src', 'GitHub', 'DiagGitHub.js'));
    
    console.log('Pushing du code vers le dépôt GitHub...');
    try {
        github.pushChanges();
        console.log('Code poussé avec succès sur le dépôt.');
    } catch (error) {
        console.log('Erreur lors du push vers le dépôt :', error.message);
    }
    
    // Mise à jour de Branche.git
    const activeBranch = github.getCurrentBranch();
    fs.writeFileSync('Branche.git', activeBranch);
    console.log('Branche active mise à jour dans Branche.git :', activeBranch);
    
    console.log('UpdateProject.js terminé.');
    
    // Restauration de console.log
    console.log = originalConsoleLog;
    logStream.end();
}

updateProject();

module.exports = { updateProject };