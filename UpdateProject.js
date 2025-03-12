const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src', 'GitHub');
const github = require(path.join(SRC_DIR, 'GitHub.js'));

function updateProject() {
    console.log('Lancement de UpdateProject.js...');
    console.log('-------------');

    try {
        // Crée test.txt et écrit "test" dedans
        fs.writeFileSync('test.txt', 'test');
        console.log('Fichier test.txt créé avec succès.');

        // Ajoute, commit et push les modifications
        execSync('git add .', { stdio: 'inherit' });
        console.log('Fichiers ajoutés à Git.');

        execSync('git commit -m "Ajout de test.txt via UpdateProject.js" --allow-empty', { stdio: 'inherit' });
        console.log('Commit créé avec succès.');

        execSync('git push origin main', { stdio: 'inherit' });
        console.log('Modifications poussées vers le dépôt distant.');

        // Vérifie les fichiers locaux
        github.listLocalFiles();
        console.log('Contenu local vérifié.');

        console.log('Projet mis à jour et poussé avec succès.');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du projet :', error.message);
    }
    console.log('-------------');
    console.log('Terminé !');
}

updateProject();

module.exports = { updateProject };