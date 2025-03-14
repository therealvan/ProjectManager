const { execSync } = require('child_process');
const path = require('path');

function updateProject() {
    console.log('Lancement de UpdateProject.js...');
    console.log('-------------');

    try {
        console.log('Ajout des modifications locales...');
        execSync('git add .', { stdio: 'inherit' });
        console.log('Modifications ajoutées.');
    } catch (error) {
        console.error('Erreur lors de l’ajout des modifications :', error.message);
        return;
    }

    try {
        console.log('Création d’un commit...');
        execSync('git commit -m "Mise à jour du projet" --allow-empty', { stdio: 'inherit' });
        console.log('Commit créé avec succès.');
    } catch (error) {
        console.error('Erreur lors de la création du commit :', error.message);
        return;
    }

    try {
        console.log('Poussée des modifications vers le dépôt distant...');
        execSync('git push origin V1.0.0', { stdio: 'inherit' });
        console.log('Modifications poussées avec succès.');
    } catch (error) {
        console.error('Erreur lors de la poussée vers le dépôt :', error.message);
        return;
    }

    console.log('-------------');
    console.log('Mise à jour et poussée terminées !');
}

updateProject();

module.exports = { updateProject };