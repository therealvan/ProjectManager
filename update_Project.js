// update_project.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function ensureScriptExists() {
    const scriptPath = path.join(__dirname, 'update_project.js');
    const scriptContent = `// update_project.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function ensureScriptExists() {
    const scriptPath = path.join(__dirname, 'update_project.js');
    if (!fs.existsSync(scriptPath)) {
        fs.writeFileSync(scriptPath, require('fs').readFileSync(__filename, 'utf8'));
    }
}

function initializeGitAndConnectToGitHub() {
    if (!fs.existsSync('.git')) {
        execSync('git init');
    }
    try {
        execSync('git remote add origin https://github.com/therealvan/ProjectManager.git');
    } catch (e) {
        console.log('Remote déjà ajouté ou erreur mineure, on continue.');
    }
    execSync('git fetch origin');
    execSync('git checkout main || git checkout -b main');
    execSync('git pull origin main');
    execSync('git add .');
    execSync('git commit -m "Mise à jour initiale du projet" --allow-empty');
    execSync('git push -u origin main');
}

try {
    ensureScriptExists();
    initializeGitAndConnectToGitHub();
    console.log('Projet connecté à GitHub et mis à jour avec succès.');
} catch (error) {
    console.error('Erreur lors de la mise à jour du projet :', error);
}
`;

    if (!fs.existsSync(scriptPath)) {
        try {
            fs.mkdirSync(__dirname, { recursive: true });
            fs.writeFileSync(scriptPath, scriptContent);
            console.log('Fichier update_project.js créé à ' + scriptPath);
            execSync('node ' + scriptPath);
        } catch (writeError) {
            console.error('Erreur lors de la création ou exécution :', writeError);
            console.log('Tentative échouée. Vérification manuelle requise.');
        }
        return;
    }
}

function initializeGitAndConnectToGitHub() {
    if (!fs.existsSync('.git')) {
        execSync('git init');
    }
    try {
        execSync('git remote add origin https://github.com/therealvan/ProjectManager.git');
    } catch (e) {
        console.log('Remote déjà ajouté ou erreur mineure, on continue.');
    }
    execSync('git fetch origin');
    execSync('git checkout main || git checkout -b main');
    execSync('git pull origin main');
    execSync('git add .');
    execSync('git commit -m "Mise à jour initiale du projet" --allow-empty');
    execSync('git push -u origin main');
}

try {
    ensureScriptExists();
    initializeGitAndConnectToGitHub();
    console.log('Projet connecté à GitHub et mis à jour avec succès.');
} catch (error) {
    console.error('Erreur lors de la mise à jour du projet :', error);
}