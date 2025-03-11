// GitHub.js - Module pour interagir avec GitHub
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function scanAndPush(message) {
    try {
        const rootDir = path.resolve(__dirname, '../..'); // Remonte à la racine du projet
        console.log('Scanning root directory:', rootDir);
        const allFiles = [];
        function scanDir(dir) {
            const items = fs.readdirSync(dir, { withFileTypes: true });
            for (const item of items) {
                const fullPath = path.join(dir, item.name);
                if (item.isDirectory() && item.name !== '.git') {
                    allFiles.push(fullPath);
                    scanDir(fullPath);
                } else if (item.isFile()) {
                    allFiles.push(fullPath);
                }
            }
        }
        scanDir(rootDir);
        console.log('Fichiers et dossiers détectés :', allFiles);
        execSync('git add .', { stdio: 'inherit' });
        execSync(`git commit --allow-empty -m "${message}"`, { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });
        console.log('Changements poussés avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du scan ou du push : " + error.message);
        throw error;
    }
}

function listRemoteFiles() {
    try {
        const files = execSync('git ls-tree -r origin/main', { encoding: 'utf8' });
        console.log('Fichiers sur GitHub :', files);
        return files;
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la vérification des fichiers : " + error.message);
        throw error;
    }
}

module.exports = { scanAndPush, listRemoteFiles };
