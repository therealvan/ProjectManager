const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_DIR = path.join(__dirname);
const LOG_FILE = path.join(PROJECT_DIR, 'project.log');
const SRC_DIR = path.join(PROJECT_DIR, 'src', 'GitHub');
const REPO_URL = 'https://github.com/therealvan/ProjectManager.git';
const BACKUP_DIR = path.join(PROJECT_DIR, 'backup_local');

// Fonction pour écrire dans le fichier de log
function logToFile(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
}

// Redirige les sorties console vers le fichier de log
const originalConsoleLog = console.log;
console.log = function (message) {
    originalConsoleLog.apply(console, arguments);
    logToFile(message);
};
const originalConsoleError = console.error;
console.error = function (message) {
    originalConsoleError.apply(console, arguments);
    logToFile(`ERROR: ${message}`);
};

// Sauvegarde les fichiers locaux
function backupLocalFiles() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    const files = fs.readdirSync(PROJECT_DIR);
    for (const file of files) {
        if (file !== '.git' && file !== 'backup_local') {
            const src = path.join(PROJECT_DIR, file);
            const dest = path.join(BACKUP_DIR, file);
            if (fs.lstatSync(src).isDirectory()) {
                fs.cpSync(src, dest, { recursive: true, force: true });
            } else {
                fs.copyFileSync(src, dest);
            }
        }
    }
    console.log('Fichiers locaux sauvegardés dans backup_local.');
}

// Fonction principale pour mettre à jour le projet
function updateProject() {
    console.log('Démarrage de UpdateProject.js...');

    // Crée le fichier de log s'il n'existe pas
    if (!fs.existsSync(LOG_FILE)) {
        fs.writeFileSync(LOG_FILE, 'Project log initialized\n');
        console.log('Fichier project.log créé.');
    }

    // Sauvegarde les fichiers locaux avant toute opération
    backupLocalFiles();

    // Charge les modules GitHub
    const github = require(path.join(SRC_DIR, 'GitHub.js'));

    // Synchronise avec le dépôt distant
    console.log('Synchronisation avec le dépôt distant...');
    try {
        // Réinitialise le dépôt pour éviter les conflits
        execSync('git fetch origin', { stdio: 'inherit' });
        execSync('git reset --hard origin/main', { stdio: 'inherit' });
        console.log('Dépôt local réinitialisé sur origin/main.');

        // Restaure les fichiers locaux depuis la sauvegarde
        const backupFiles = fs.readdirSync(BACKUP_DIR);
        for (const file of backupFiles) {
            const src = path.join(BACKUP_DIR, file);
            const dest = path.join(PROJECT_DIR, file);
            if (fs.lstatSync(src).isDirectory()) {
                fs.cpSync(src, dest, { recursive: true, force: true });
            } else {
                fs.copyFileSync(src, dest);
            }
        }
        console.log('Fichiers locaux restaurés depuis la sauvegarde.');
    } catch (error) {
        console.error('Erreur lors de la synchronisation : ' + error.message);
        throw error;
    }

    // Ajoute, commit et push les modifications
    console.log('Ajout des fichiers locaux à Git...');
    execSync('git add .', { stdio: 'inherit' });
    console.log('Fichiers ajoutés avec succès.');

    console.log('Création du commit...');
    execSync('git commit -m "Mise à jour du projet depuis UpdateProject.js" --allow-empty', { stdio: 'inherit' });
    console.log('Commit créé avec succès.');

    console.log('Pousse des modifications vers le dépôt distant...');
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('Modifications poussées avec succès.');

    // Vérifie les fichiers locaux après le push
    github.listLocalFiles();

    console.log('UpdateProject.js terminé.');
}

// Vérifie la syntaxe avant exécution
try {
    new Function(fs.readFileSync(__filename, 'utf8'));
    console.log('Syntaxe de UpdateProject.js valide.');
    updateProject();
} catch (error) {
    console.error('Erreur dans UpdateProject.js : ' + error.message);
}

module.exports = { updateProject };