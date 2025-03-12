const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src', 'GitHub');
const github = require(path.join(SRC_DIR, 'GitHub.js'));

function updateProject() {
    console.log('Lancement de UpdateProject.js...');
    console.log('-------------');

    try {
        // Supprime test.txt localement
        if (fs.existsSync('test.txt')) {
            fs.unlinkSync('test.txt');
            console.log('Fichier test.txt supprimé localement.');
        } else {
            console.log('Fichier test.txt non trouvé localement.');
        }

        // Ajoute la suppression à Git
        execSync('git add .', { stdio: 'inherit' });
        console.log('Suppression de test.txt ajoutée à Git.');

        execSync('git commit -m "Suppression de test.txt via UpdateProject.js" --allow-empty', { stdio: 'inherit' });
        console.log('Commit de suppression créé avec succès.');

        execSync('git push origin main', { stdio: 'inherit' });
        console.log('Suppression de test.txt poussée vers le dépôt distant.');

        // Crée test2.txt et écrit quelque chose dedans
        fs.writeFileSync('test2.txt', 'test2');
        console.log('Fichier test2.txt créé avec succès.');

        // Ajoute, commit et push test2.txt
        execSync('git add .', { stdio: 'inherit' });
        console.log('Fichier test2.txt ajouté à Git.');

        execSync('git commit -m "Ajout de test2.txt via UpdateProject.js" --allow-empty', { stdio: 'inherit' });
        console.log('Commit de test2.txt créé avec succès.');

        execSync('git push origin main', { stdio: 'inherit' });
        console.log('Fichier test2.txt poussé vers le dépôt distant.');

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