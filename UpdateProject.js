// UpdateProject.js - Script pour mettre à jour le projet et pousser les modifications vers GitHub
const fs = require('fs');
const path = require('path');
const { generateTree } = require('./ProjectTree.js'); // Pour régénérer Tree.grok
const { writeCodeGrok } = require('./Code.js'); // Pour régénérer code.grok
const { listFunctionsInJsFiles } = require('./Functions.js'); // Pour régénérer Functions.grok
const { pushChanges } = require('./src/GitHub/GitHub.js'); // Pour pousser vers GitHub
const { updateReadme } = require('./Readme.js'); // Pour mettre à jour README.md

const PROJECT_DIR = __dirname;
const LOG_FILE = path.join(PROJECT_DIR, 'project.log');

// Fonction pour écrire dans le fichier de log
function logToFile(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`, 'utf8');
    console.log(message);
}

// Fonction principale pour mettre à jour le projet
function pushLocalCode() {
    logToFile('Démarrage de la mise à jour du projet...');

    try {
        // Étape 1 : Régénérer Tree.grok
        logToFile('Génération de Tree.grok...');
        generateTree('Tree.grok')
            .then(() => logToFile('Tree.grok régénéré avec succès.'))
            .catch(err => logToFile(`Erreur lors de la génération de Tree.grok : ${err.message}`));

        // Étape 2 : Régénérer code.grok
        logToFile('Génération de code.grok...');
        writeCodeGrok();
        logToFile('code.grok régénéré avec succès.');

        // Étape 3 : Régénérer Functions.grok
        logToFile('Génération de Functions.grok...');
        listFunctionsInJsFiles();
        logToFile('Functions.grok régénéré avec succès.');

        // Étape 4 : Mettre à jour README.md
        logToFile('Mise à jour de README.md...');
        updateReadme();
        logToFile('README.md mis à jour avec succès.');

        // Étape 5 : Pousser les changements vers GitHub
        logToFile('Poussée des changements locaux vers GitHub...');
        pushChanges();
        logToFile('Changements poussés avec succès vers GitHub.');

        logToFile('Mise à jour du projet terminée avec succès.');
    } catch (error) {
        logToFile(`Erreur lors de la mise à jour du projet : ${error.message}`);
        console.error(error.stack);
    }
}

// Exporter la fonction pour un usage externe
module.exports = { pushLocalCode };

// Exécuter directement si appelé comme script principal
if (require.main === module) {
    pushLocalCode();
}