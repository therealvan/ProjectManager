const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const github = require('./src/GitHub/GitHub.js');
const debug = require('./src/GitHub/DiagGitHub.js');

console.log('Lancement de UpdateProject.js...');

function updateProject() {
    try {
        // Vérifie si http-server est installé, sinon l’installe
        console.log('Vérification de http-server...');
        try {
            execSync('npx http-server --version', { stdio: 'inherit' });
            console.log('http-server déjà installé.');
        } catch (e) {
            console.log('Installation de http-server...');
            execSync('npm install -g http-server', { stdio: 'inherit' });
            console.log('http-server installé.');
        }

        // Vérifie que src/webgl/ existe
        const webglDir = path.join(__dirname, 'src', 'webgl');
        if (!fs.existsSync(webglDir)) {
            debug.log('Dossier src/webgl/ manquant.');
            throw new Error('Dossier src/webgl/ introuvable.');
        }

        // Git operations pour s’assurer que tout est à jour
        console.log('Ajout des fichiers locaux...');
        execSync('git add .', { stdio: 'inherit' });

        console.log('Création du commit...');
        execSync('git commit -m "Ajout de http-server pour lancer le projet WebGL" --allow-empty', { stdio: 'inherit' });

        console.log('Pousse des modifications vers le dépôt distant...');
        execSync('git push origin main', { stdio: 'inherit' });

        console.log('Liste des fichiers locaux après push...');
        github.listLocalFiles();

        // Lance http-server dans src/webgl/
        console.log('Lancement de http-server dans src/webgl/...');
        process.chdir(webglDir); // Change le répertoire de travail
        execSync('npx http-server -p 8080', { stdio: 'inherit' });

        console.log('Serveur lancé. Ouvre http://localhost:8080 dans ton navigateur.');
        console.log('UpdateProject.js terminé.');
    } catch (error) {
        debug.log('Erreur lors de la mise à jour : ' + error.message);
    }
}

updateProject();