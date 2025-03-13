const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PROJECT_DIR = path.join(__dirname);
const LOG_FILE = path.join(PROJECT_DIR, 'project.log');
const REPO_URL = 'https://github.com/therealvan/ProjectManager.git';
const OLD_BRANCH = 'main';
const NEW_BRANCH = 'V1.0.0';

// Fonction pour écrire dans project.log
function logToFile(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
}

// Redirige console.log vers project.log
const originalConsoleLog = console.log;
console.log = function (message) {
    logToFile(message);
    originalConsoleLog.apply(console, arguments);
};

function updateProject() {
    console.log('Lancement de UpdateProject.js...');
    try {
        // Mise à jour de GitHub.js avec la logique corrigée
        const githubPath = path.join(PROJECT_DIR, 'src', 'GitHub', 'GitHub.js');
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
            `            execSync('git add .', { stdio: 'inherit' });\r\n` +
            `            execSync('git commit -m "Sauvegarde automatique avant changement de branche" --allow-empty', { stdio: 'inherit' });\r\n` +
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
            `function pushLocalChanges(branch = 'main') {\r\n` +
            `    try {\r\n` +
            `        console.log('Ajout des modifications locales...');\r\n` +
            `        execSync('git add .', { stdio: 'inherit' });\r\n` +
            `        console.log('Création du commit...');\r\n` +
            `        execSync('git commit -m "Push des modifications locales" --allow-empty', { stdio: 'inherit' });\r\n` +
            `        console.log('Pousse vers le dépôt distant...');\r\n` +
            `        execSync(\`git push origin \${branch}\`, { stdio: 'inherit' });\r\n` +
            `        console.log('Modifications poussées avec succès.');\r\n` +
            `    } catch (error) {\r\n` +
            `        const debug = require('./DiagGitHub.js');\r\n` +
            `        debug.log("Erreur lors du push des modifications : " + error.message);\r\n` +
            `        throw error;\r\n` +
            `    }\r\n` +
            `}\r\n` +
            `\r\n` +
            `function renameBranch(oldBranch, newBranch) {\r\n` +
            `    try {\r\n` +
            `        console.log("Renommage de la branche " + oldBranch + " en " + newBranch + "...");\r\n` +
            `        execSync('git add .', { stdio: 'inherit' });\r\n` +
            `        execSync('git commit -m "Sauvegarde avant renommage" --allow-empty', { stdio: 'inherit' });\r\n` +
            `        execSync(\`git branch -m \${oldBranch} \${newBranch}\`, { stdio: 'inherit' });\r\n` +
            `        console.log('Branche renommée localement.');\r\n` +
            `        execSync(\`git push origin :\${oldBranch} \${newBranch}\`, { stdio: 'inherit' });\r\n` +
            `        console.log('Branche renommée poussée vers le dépôt distant.');\r\n` +
            `        execSync(\`git push origin -u \${newBranch}\`, { stdio: 'inherit' });\r\n` +
            `        console.log("Branche " + newBranch + " définie comme suivi distant.");\r\n` +
            `    } catch (error) {\r\n` +
            `        const debug = require('./DiagGitHub.js');\r\n` +
            `        debug.log("Erreur lors du renommage de la branche : " + error.message);\r\n` +
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
            `module.exports = { cloneOrUpdateRepo, pushLocalChanges, renameBranch, listLocalFiles };\r\n`
        );

        // Appel des fonctions depuis GitHub.js
        const github = require(githubPath);
        console.log(`Connexion à la branche ${OLD_BRANCH} du dépôt ${REPO_URL}`);
        github.cloneOrUpdateRepo(REPO_URL, OLD_BRANCH);
        console.log(`Renommage de ${OLD_BRANCH} en ${NEW_BRANCH}`);
        github.renameBranch(OLD_BRANCH, NEW_BRANCH);
        console.log(`Branche renommée en ${NEW_BRANCH} et poussée avec succès.`);
    } catch (error) {
        console.error('Erreur lors de la mise à jour ou du renommage :', error.message);
    }
}

updateProject();