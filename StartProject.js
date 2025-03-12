const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration du projet
const REPO_URL = 'https://github.com/therealvan/ProjectManager.git';
const PROJECT_DIR = path.join(__dirname);
const SRC_DIR = path.join(PROJECT_DIR, 'src', 'GitHub');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startProject() {
    console.log('Démarrage de StartProject.js...');
    console.log('-------------');

    // Étape 1 : Vérifie la présence de Git
    try {
        console.log('Vérification de Git...');
        execSync('git --version', { stdio: 'inherit' });
        console.log('Étape 1 : Git OK.');
    } catch (error) {
        console.error('Étape 1 : Erreur - Git n’est pas installé ou inaccessible :', error.message);
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
        execSync(`git clone -b main ${REPO_URL} ${tempDir}`, { stdio: 'inherit' });
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
        console.log('Étape 3 : Dépôt cloné avec succès à la racine sur la branche main.');
    } catch (error) {
        console.error('Étape 3 : Erreur lors du clonage :', error.message);
        return;
    }
    console.log('-------------');

    // Étape 4 : Crée ou met à jour GitHub.js et DiagGitHub.js dans src/GitHub
    try {
        console.log('Vérification de src/GitHub à la racine...');
        if (!fs.existsSync(SRC_DIR)) {
            fs.mkdirSync(SRC_DIR, { recursive: true });
            console.log('Dossier src/GitHub créé à la racine.');
        }
        const diagPath = path.join(SRC_DIR, 'DiagGitHub.js');
        fs.writeFileSync(diagPath, 
            `// DiagGitHub.js - Module de débogage conditionnel\r\n` +
            `function log(message) {\r\n` +
            `    console.error("Erreur détectée : " + message);\r\n` +
            `}\r\n` +
            `module.exports = { log };\r\n`
        );
        const githubPath = path.join(SRC_DIR, 'GitHub.js');
        fs.writeFileSync(githubPath, 
            `// GitHub.js - Module pour interagir avec GitHub\r\n` +
            `const { execSync } = require('child_process');\r\n` +
            `const fs = require('fs');\r\n` +
            `\r\n` +
            `function cloneOrUpdateRepo(repoUrl, branch = 'main') {\r\n` +
            `    try {\r\n` +
            `        if (!fs.existsSync('.git')) {\r\n` +
            `            console.log('Clonage du dépôt à la racine...');\r\n` +
            `            execSync(\`git clone -b \${branch} \${repoUrl} .\`, { stdio: 'inherit' });\r\n` +
            `            console.log('Dépôt cloné avec succès à la racine.');\r\n` +
            `        } else {\r\n` +
            `            console.log('Mise à jour du dépôt à la racine...');\r\n` +
            `            execSync('git fetch origin', { stdio: 'inherit' });\r\n` +
            `            execSync(\`git checkout \${branch}\`, { stdio: 'inherit' });\r\n` +
            `            execSync(\`git pull origin \${branch}\`, { stdio: 'inherit' });\r\n` +
            `            console.log('Dépôt mis à jour avec succès à la racine.');\r\n` +
            `        }\r\n` +
            `    } catch (error) {\r\n` +
            `        const debug = require('./DiagGitHub.js');\r\n` +
            `        debug.log("Erreur lors du clonage ou de la mise à jour du dépôt : " + error.message);\r\n` +
            `        throw error;\r\n` +
            `    }\r\n` +
            `}\r\n` +
            `\r\n` +
            `function listLocalFiles() {\r\n` +
            `    try {\r\n` +
            `        const files = fs.readdirSync('.', { withFileTypes: true });\r\n` +
            `        const fileList = files.map(item => item.isDirectory() ? item.name + '/' : item.name);\r\n` +
            `        console.log('Fichiers locaux après téléchargement :', fileList);\r\n` +
            `        return fileList;\r\n` +
            `    } catch (error) {\r\n` +
            `        const debug = require('./DiagGitHub.js');\r\n` +
            `        debug.log("Erreur lors de la liste des fichiers locaux : " + error.message);\r\n` +
            `        throw error;\r\n` +
            `    }\r\n` +
            `}\r\n` +
            `\r\n` +
            `module.exports = { cloneOrUpdateRepo, listLocalFiles };\r\n`
        );
        console.log('Étape 4 : GitHub.js et DiagGitHub.js prêts à la racine.');
    } catch (error) {
        console.error('Étape 4 : Erreur lors de la création des fichiers :', error.message);
        return;
    }
    console.log('-------------');

    // Charge les modules
    let github;
    try {
        github = require(path.join(SRC_DIR, 'GitHub.js'));
        console.log('Modules chargés avec succès.');
    } catch (error) {
        console.error('Erreur lors du chargement des modules :', error.message);
        return;
    }
    console.log('-------------');

    // Étape 5 : Ajoute, commit et push les modifications
    try {
        console.log('Ajout des fichiers locaux à Git...');
        execSync('git add .', { stdio: 'inherit' });
        console.log('Fichiers ajoutés avec succès.');

        console.log('Création du commit...');
        execSync('git commit -m "Initialisation du projet depuis StartProject.js" --allow-empty', { stdio: 'inherit' });
        console.log('Commit créé avec succès.');

        console.log('Pousse des modifications vers le dépôt distant...');
        execSync('git push origin main', { stdio: 'inherit' });
        console.log('Modifications poussées avec succès.');
    } catch (error) {
        console.error('Étape 5 : Erreur lors de l’ajout, commit ou push :', error.message);
        return;
    }
    console.log('-------------');

    // Étape 6 : Liste les fichiers locaux après initialisation
    try {
        console.log('Vérification des fichiers locaux à la racine...');
        github.listLocalFiles();
        console.log('Étape 6 : Contenu local vérifié.');
    } catch (error) {
        console.error('Étape 6 : Erreur lors de la vérification :', error.message);
        return;
    }
    console.log('-------------');

    console.log('Terminé !');
}

// Exécute la fonction principale
try {
    console.log('Tentative d’exécution de startProject...');
    startProject().catch(err => console.error('Erreur globale dans StartProject.js :', err.message));
} catch (error) {
    console.error('Erreur globale dans StartProject.js :', error.message);
}

module.exports = { startProject };