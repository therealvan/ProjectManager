const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration du projet
const REPO_URL = 'https://github.com/therealvan/ProjectManager.git';
const PROJECT_DIR = path.join(__dirname);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startProject() {
    console.log('Démarrage de StartProject.js...');
    console.log('-------------');

    // Étape 1 : Vérifie la présence de Git (suppose que Git est installé via npm ou système)
    try {
        console.log('Vérification de Git...');
        execSync('git --version', { stdio: 'inherit' });
        console.log('Étape 1 : Git OK.');
    } catch (error) {
        console.error('Étape 1 : Erreur - Git n’est pas installé ou inaccessible :', error.message);
        console.log('Veuillez installer Git manuellement ou via npm.');
        return;
    }
    console.log('-------------');

    // Étape 2 : Prépare le dossier principal et supprime tout sauf StartProject.js et UpdateProject.js
    try {
        console.log('Vérification et nettoyage du dossier principal :', PROJECT_DIR);
        if (!fs.existsSync(PROJECT_DIR)) {
            fs.mkdirSync(PROJECT_DIR, { recursive: true });
            console.log('Dossier ProjectManager créé.');
        }
        const files = fs.readdirSync(PROJECT_DIR);
        for (const file of files) {
            if (file !== 'StartProject.js' && file !== 'UpdateProject.js') {
                const filePath = path.join(PROJECT_DIR, file);
                let retries = 3;
                while (retries > 0) {
                    try {
                        if (fs.lstatSync(filePath).isDirectory()) {
                            fs.rmSync(filePath, { recursive: true, force: true });
                        } else {
                            fs.unlinkSync(filePath);
                        }
                        break;
                    } catch (err) {
                        if (err.code === 'EBUSY') {
                            console.log(`Fichier ${file} verrouillé, attente 1s...`);
                            await delay(1000);
                            retries--;
                            if (retries === 0) throw err;
                        } else {
                            throw err;
                        }
                    }
                }
            }
        }
        console.log('Étape 2 : Dossier nettoyé, seuls StartProject.js et UpdateProject.js restent.');
        process.chdir(PROJECT_DIR);
        console.log('Répertoire de travail changé à :', process.cwd());
    } catch (error) {
        console.error('Étape 2 : Erreur lors du nettoyage ou de la préparation du dossier :', error.message);
        return;
    }
    console.log('-------------');

    // Étape 3 : Clone le dépôt dans un dossier temporaire puis déplace à la racine
    try {
        console.log('Lancement du clonage à la racine...');
        const tempDir = path.join(PROJECT_DIR, 'temp_repo');
        if (fs.existsSync(tempDir)) {
            let retries = 3;
            while (retries > 0) {
                try {
                    fs.rmSync(tempDir, { recursive: true, force: true });
                    break;
                } catch (err) {
                    if (err.code === 'EBUSY') {
                        console.log('Dossier temp_repo verrouillé, attente 1s...');
                        await delay(1000);
                        retries--;
                        if (retries === 0) throw err;
                    } else {
                        throw err;
                    }
                }
            }
        }
        execSync(`git clone -b V1.0.0 ${REPO_URL} ${tempDir}`, { stdio: 'inherit' });
        const tempFiles = fs.readdirSync(tempDir);
        for (const file of tempFiles) {
            if (file !== '.git') {
                let retries = 3;
                while (retries > 0) {
                    try {
                        fs.renameSync(path.join(tempDir, file), path.join(PROJECT_DIR, file));
                        break;
                    } catch (err) {
                        if (err.code === 'EBUSY') {
                            console.log(`Fichier ${file} verrouillé, attente 1s...`);
                            await delay(1000);
                            retries--;
                            if (retries === 0) throw err;
                        } else {
                            throw err;
                        }
                    }
                }
            }
        }
        fs.renameSync(path.join(tempDir, '.git'), path.join(PROJECT_DIR, '.git'));
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log('Étape 3 : Dépôt cloné avec succès à la racine sur la branche V1.0.0.');
    } catch (error) {
        console.error('Étape 3 : Erreur lors du clonage :', error.message);
        return;
    }
    console.log('-------------');

    // Étape 4 : Liste les fichiers locaux après clonage
    try {
        console.log('Vérification des fichiers locaux à la racine...');
        const files = fs.readdirSync('.', { withFileTypes: true });
        const fileList = files.map(item => item.isDirectory() ? item.name + '/' : item.name);
        console.log('Fichiers locaux après clonage :', fileList);
        console.log('Étape 4 : Contenu local vérifié.');
    } catch (error) {
        console.error('Étape 4 : Erreur lors de la vérification :', error.message);
        return;
    }
    console.log('-------------');

    // Étape 5 : Lance Arborescence.js
    try {
        console.log('Lancement de Arborescence.js...');
        const arborescence = require(path.join(PROJECT_DIR, 'Arborescence.js'));
        arborescence.generateArborescence();
        console.log('Étape 5 : Arborescence.js exécuté avec succès.');
    } catch (error) {
        console.error('Étape 5 : Erreur lors de l’exécution de Arborescence.js :', error.message);
    }
    console.log('-------------');

    // Ajout demandé : Exécute Fonctions.js et Arborescence.js à la fin
    try {
        console.log('Exécution de Fonctions.js...');
        const fonctions = require(path.join(PROJECT_DIR, 'Fonctions.js'));
        fonctions.main(); // Suppose une fonction main dans Fonctions.js
    } catch (error) {
        console.error('Erreur lors de l’exécution de Fonctions.js :', error.message);
    }

    try {
        console.log('Lancement final de Arborescence.js...');
        const arborescence = require(path.join(PROJECT_DIR, 'Arborescence.js'));
        arborescence.generateArborescence();
    } catch (error) {
        console.error('Erreur lors de l’exécution finale de Arborescence.js :', error.message);
    }

    console.log('Terminé !');

    // Étape finale : Récupère la branche active et l'écrit dans Branche.git
    try {
        console.log('Récupération de la branche active...');
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
        fs.writeFileSync('Branche.git', branch);
        console.log('Branche active (' + branch + ') écrite dans Branche.git.');
    } catch (error) {
        console.error('Erreur lors de la récupération de la branche :', error.message);
    }
    
}

// Exécute la fonction principale
try {
    console.log('Tentative d’exécution de startProject...');
    startProject().catch(err => console.error('Erreur globale dans StartProject.js :', err.message));
} catch (error) {
    console.error('Erreur globale dans StartProject.js :', error.message);
}

module.exports = { startProject };