const fs = require('fs');
const path = require('path');
const github = require('./src/GitHub/GitHub.js');
const { execSync } = require('child_process');

// Redirige les sorties vers project.log
const logStream = fs.createWriteStream(path.join(__dirname, 'project.log'), { flags: 'a' });
console.log = (...args) => logStream.write(args.join(' ') + '\n');

// Vérifie et crée project.log si nécessaire
if (!fs.existsSync(path.join(__dirname, 'project.log'))) {
    fs.writeFileSync(path.join(__dirname, 'project.log'), '');
}

console.log('Début de la mise à jour du dépôt...');

// Ajoute tous les fichiers
github.addFiles('.');

// Commit les changements
github.commitChanges('Mise à jour du projet avec Code.js et code.grok');

// Pousse les changements
github.pushChanges();

console.log('Code poussé avec succès sur GitHub.');