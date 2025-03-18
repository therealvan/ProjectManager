// UpdateProject.js - Push local code to GitHub using GitHub.js and DiagGitHub.js
const fs = require('fs');
const path = require('path');
const { pushChanges } = require('./src/GitHub/GitHub.js');
const { log } = require('./src/GitHub/DiagGitHub.js');

// Fonction pour pousser le code local
function pushLocalCode() {
    try {
        // Vérifier si le répertoire est un dépôt Git
        if (!fs.existsSync(path.join(__dirname, '.git'))) {
            log('Erreur : Le répertoire actuel n’est pas un dépôt Git.');
            return;
        }

        // Pousser les changements vers GitHub
        pushChanges();
        console.log('Code local poussé vers GitHub avec succès.');
    } catch (error) {
        log(`Erreur lors de la poussée du code vers GitHub : ${error.message}`);
    }
}

// Exécuter la fonction
pushLocalCode();