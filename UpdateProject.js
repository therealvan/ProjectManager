const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_DIR = path.join(__dirname);
const LOG_FILE = path.join(PROJECT_DIR, 'project.log');
const SRC_DIR = path.join(PROJECT_DIR, 'src', 'GitHub');
const REPO_URL = 'https://github.com/therealvan/ProjectManager.git';

function logToFile(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
    console.log(message);
}

function updateProject() {
    try {
        logToFile('Démarrage de UpdateProject.js...');

        // Charge les modules GitHub.js et DiagGitHub.js
        const github = require(path.join(SRC_DIR, 'GitHub.js'));
        const debug = require(path.join(SRC_DIR, 'DiagGitHub.js'));

        // Étape 1 : Mise à jour ou clonage du dépôt
        logToFile('Mise à jour ou clonage du dépôt local...');
        github.cloneOrUpdateRepo(REPO_URL, 'main');

        // Étape 2 : Ajout des fichiers locaux
        logToFile('Ajout des modifications locales à Git...');
        execSync('git add .', { stdio: 'inherit' });
        logToFile('Fichiers ajoutés avec succès.');

        // Étape 3 : Création du commit
        logToFile('Création du commit...');
        execSync('git commit -m "Mise à jour depuis UpdateProject.js" --allow-empty', { stdio: 'inherit' });
        logToFile('Commit créé avec succès.');

        // Étape 4 : Push vers le dépôt distant
        logToFile('Push des modifications vers le dépôt distant...');
        execSync('git push origin main', { stdio: 'inherit' });
        logToFile('Modifications poussées avec succès.');

        // Étape 5 : Vérification des fichiers locaux
        logToFile('Vérification des fichiers locaux après push...');
        github.listLocalFiles();

    } catch (error) {
        logToFile(`Erreur lors de la mise à jour ou du push : ${error.message}`);
        const debug = require(path.join(SRC_DIR, 'DiagGitHub.js'));
        debug.log(`Erreur dans updateProject : ${error.message}`);
        throw error;
    }
}

try {
    if (!fs.existsSync(LOG_FILE)) {
        fs.writeFileSync(LOG_FILE, 'Initialisation du journal de projet\n');
    }
    logToFile('Tentative d’exécution de updateProject...');
    updateProject();
    logToFile('UpdateProject.js terminé avec succès.');
} catch (error) {
    logToFile(`Erreur globale dans UpdateProject.js : ${error.message}`);
}

module.exports = { updateProject };