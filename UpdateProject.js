const fs = require('fs');
const path = require('path');

const PROJECT_DIR = path.join(__dirname);
const LOG_FILE = path.join(PROJECT_DIR, 'project.log');

function logToFile(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`, 'utf8');
    console.log(message);
}

function updateProject() {
    logToFile('Démarrage de UpdateProject.js V2...');
    logToFile('-------------');

    // Appel à LaunchProject.js pour lancer le projet
    try {
        logToFile('Tentative de chargement de LaunchProject.js...');
        const launchProject = require(path.join(PROJECT_DIR, 'LaunchProject.js'));
        logToFile('Lancement du projet via LaunchProject.js...');
        launchProject.launchProject();
        logToFile('Projet lancé avec succès.');
    } catch (error) {
        logToFile(`Erreur lors du lancement du projet : ${error.message}`);
        logToFile(`Détails de l’erreur : ${error.stack}`);
        return;
    }

    logToFile('-------------');
    logToFile('Terminé !');
}

try {
    if (!fs.existsSync(LOG_FILE)) {
        fs.writeFileSync(LOG_FILE, '');
        logToFile('Fichier project.log créé.');
    }
    updateProject();
} catch (error) {
    logToFile(`Erreur globale dans UpdateProject.js : ${error.message}`);
    logToFile(`Détails de l’erreur : ${error.stack}`);
}

module.exports = { updateProject };