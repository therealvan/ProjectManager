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

    // Contenu corrigé de GitHub.js
    const gitHubContent = `const { execSync } = require('child_process');
const fs = require('fs');

function getCurrentBranch() {
    if (fs.existsSync('Branche.git')) {
        return fs.readFileSync('Branche.git', 'utf8').trim();
    } else {
        throw new Error('Fichier Branche.git introuvable');
    }
}

function addFiles(files) {
    execSync(\`git add \${files.join(' ')}\`, { stdio: 'inherit' });
    console.log('Fichiers ajoutés à l’index.');
}

function commitChanges(message) {
    execSync(\`git commit -m "\${message}"\`, { stdio: 'inherit' });
    console.log('Commit créé avec succès.');
}

function pushChanges(branch) {
    execSync(\`git push origin \${branch}\`, { stdio: 'inherit' });
    console.log('Push effectué avec succès.');
}

module.exports = { getCurrentBranch, addFiles, commitChanges, pushChanges };
`;

    fs.writeFileSync('./src/GitHub/GitHub.js', gitHubContent);
    console.log('GitHub.js mis à jour pour utiliser uniquement Branche.git.');

    // Chargement du module mis à jour
    const { getCurrentBranch, addFiles, commitChanges, pushChanges } = require('./src/GitHub/GitHub.js');

    console.log('Ajout des fichiers locaux...');
    addFiles(['.']);
    
    console.log('Création du commit...');
    commitChanges('Mise à jour de GitHub.js pour Branche.git');
    
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