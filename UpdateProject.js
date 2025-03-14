const { execSync } = require('child_process');
const fs = require('fs');

// Structure modulaire
const project = {
    pushLocal: () => {
        try {
            console.log('Ajout des fichiers locaux à Git...');
            execSync('git add .', { stdio: 'inherit' });
            console.log('Fichiers ajoutés avec succès.');

            console.log('Création du commit...');
            execSync('git commit -m "Push du code local" --allow-empty', { stdio: 'inherit' });
            console.log('Commit créé avec succès.');

            console.log('Pousse des modifications vers le dépôt distant...');
            execSync('git push origin V1.0.0', { stdio: 'inherit' });
            console.log('Code local poussé avec succès');
        } catch (error) {
            console.error('Erreur lors du push du code local :', error.message);
        }
    }
};

// Exécution
project.pushLocal();