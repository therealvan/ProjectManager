const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function updateProject() {
    console.log('Lancement de la mise à jour du projet...');

    const projectDir = __dirname;
    const bibiDir = path.join(projectDir, 'bibi');

    // Supprime le dossier bibi localement
    try {
        if (fs.existsSync(bibiDir)) {
            fs.rmSync(bibiDir, { recursive: true, force: true });
            console.log('Dossier bibi supprimé localement.');
        } else {
            console.log('Dossier bibi non trouvé localement.');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression locale de bibi :', error.message);
        return;
    }

    // Ajoute, commit et push les modifications pour supprimer bibi du dépôt
    try {
        console.log('Mise à jour du dépôt Git...');
        execSync('git add .', { stdio: 'inherit' });
        execSync('git commit -m "Suppression du dossier bibi" --allow-empty', { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });
        console.log('Dossier bibi supprimé du dépôt GitHub.');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du dépôt :', error.message);
        return;
    }

    console.log('Mise à jour terminée.');
}

updateProject();

module.exports = { updateProject };