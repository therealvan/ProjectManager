const fs = require('fs');
const { execSync } = require('child_process');

function updateProject() {
    console.log('Lancement de UpdateProject.js...');
    
    // Redirection des sorties vers project.log
    const logStream = fs.createWriteStream('project.log', { flags: 'a' });
    const originalConsoleLog = console.log;
    console.log = (...args) => {
        logStream.write(args.join(' ') + '\n');
        originalConsoleLog(...args);
    };

    // Contenu corrigé de GitHub.js avec toutes les fonctions nécessaires
    const gitHubContent = `// GitHub.js - Module pour interagir avec GitHub
const { execSync } = require('child_process');
const fs = require('fs');

function getCurrentBranch() {
    if (fs.existsSync('Branche.git')) {
        return fs.readFileSync('Branche.git', 'utf8').trim();
    } else {
        throw new Error('Fichier Branche.git introuvable');
    }
}

function cloneOrUpdateRepo(repoUrl, branch = 'V1.0.0') {
    try {
        if (!fs.existsSync('.git')) {
            console.log('Clonage du dépôt à la racine...');
            execSync(\`git clone -b \${branch} \${repoUrl} .\`, { stdio: 'inherit' });
            console.log('Dépôt cloné avec succès à la racine.');
        } else {
            console.log('Mise à jour du dépôt à la racine...');
            execSync('git fetch origin', { stdio: 'inherit' });
            execSync(\`git checkout \${branch}\`, { stdio: 'inherit' });
            execSync(\`git pull origin \${branch}\`, { stdio: 'inherit' });
            console.log('Dépôt mis à jour avec succès à la racine.');
        }
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du clonage ou de la mise à jour du dépôt : " + error.message);
        throw error;
    }
}

function listLocalFiles() {
    try {
        const files = fs.readdirSync('.', { withFileTypes: true });
        const fileList = files.map(item => item.isDirectory() ? item.name + '/' : item.name);
        console.log('Fichiers locaux après téléchargement :', fileList);
        return fileList;
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la liste des fichiers locaux : " + error.message);
        throw error;
    }
}

function addFiles(pattern) {
    try {
        execSync(\`git add \${pattern}\`, { stdio: 'inherit' });
        console.log('Fichiers ajoutés à l’index.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de l’ajout des fichiers : " + error.message);
        throw error;
    }
}

function commitChanges(message) {
    try {
        execSync(\`git commit -m "\${message}" --allow-empty\`, { stdio: 'inherit' });
        console.log('Commit créé avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du commit : " + error.message);
        throw error;
    }
}

function pushChanges(branch) {
    try {
        execSync(\`git push origin \${branch}\`, { stdio: 'inherit' });
        console.log('Modifications poussées avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du push : " + error.message);
        throw error;
    }
}

function pullChanges(branch) {
    try {
        execSync(\`git pull origin \${branch}\`, { stdio: 'inherit' });
        console.log('Modifications tirées avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du pull : " + error.message);
        throw error;
    }
}

function createBranch(branchName) {
    try {
        execSync(\`git checkout -b \${branchName}\`, { stdio: 'inherit' });
        execSync(\`git push origin \${branchName}\`, { stdio: 'inherit' });
        console.log('Branche \${branchName} créée et poussée avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la création de la branche : " + error.message);
        throw error;
    }
}

function createRelease(version, message) {
    try {
        execSync(\`git tag \${version}\`, { stdio: 'inherit' });
        execSync(\`git push origin \${version}\`, { stdio: 'inherit' });
        console.log('Release \${version} créée avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la création de la release : " + error.message);
        throw error;
    }
}

function checkoutBranch(branch) {
    try {
        execSync(\`git checkout \${branch}\`, { stdio: 'inherit' });
        console.log('Branche \${branch} checkout avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du checkout : " + error.message);
        throw error;
    }
}

function mergeBranch(sourceBranch, targetBranch) {
    try {
        execSync(\`git checkout \${targetBranch}\`, { stdio: 'inherit' });
        execSync(\`git merge \${sourceBranch}\`, { stdio: 'inherit' });
        execSync(\`git push origin \${targetBranch}\`, { stdio: 'inherit' });
        console.log('Fusion de \${sourceBranch} dans \${targetBranch} réussie.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la fusion : " + error.message);
        throw error;
    }
}

function deleteBranch(branch, remote = false) {
    try {
        if (remote) {
            execSync(\`git push origin --delete \${branch}\`, { stdio: 'inherit' });
            console.log('Branche distante \${branch} supprimée.');
        } else {
            execSync(\`git branch -D \${branch}\`, { stdio: 'inherit' });
            console.log('Branche locale \${branch} supprimée.');
        }
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la suppression de la branche : " + error.message);
        throw error;
    }
}

function status() {
    try {
        const statusOutput = execSync('git status', { encoding: 'utf8' });
        console.log('État du dépôt :', statusOutput);
        return statusOutput;
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la vérification de l’état : " + error.message);
        throw error;
    }
}

function fetchRepo() {
    try {
        execSync('git fetch origin', { stdio: 'inherit' });
        console.log('Dépôt fetch avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du fetch : " + error.message);
        throw error;
    }
}

function stashChanges() {
    try {
        execSync('git stash', { stdio: 'inherit' });
        console.log('Changements stashés avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du stash : " + error.message);
        throw error;
    }
}

function applyStash(index = 0) {
    try {
        execSync(\`git stash apply stash{\${index}}\`, { stdio: 'inherit' });
        console.log('Stash \${index} appliqué avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de l’application du stash : " + error.message);
        throw error;
    }
}

function resetChanges(hard = false) {
    try {
        const mode = hard ? '--hard' : '--soft';
        execSync(\`git reset \${mode}\`, { stdio: 'inherit' });
        console.log('Reset des changements effectué avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du reset : " + error.message);
        throw error;
    }
}

function logCommits(limit = 10) {
    try {
        const logOutput = execSync(\`git log -n \${limit} --oneline\`, { encoding: 'utf8' });
        console.log('Historique des commits :', logOutput);
        return logOutput;
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la récupération des logs : " + error.message);
        throw error;
    }
}

function diffChanges() {
    try {
        const diffOutput = execSync('git diff', { encoding: 'utf8' });
        console.log('Différences :', diffOutput);
        return diffOutput;
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la récupération des différences : " + error.message);
        throw error;
    }
}

module.exports = { 
    getCurrentBranch,
    cloneOrUpdateRepo, 
    listLocalFiles, 
    addFiles, 
    commitChanges, 
    pushChanges, 
    pullChanges, 
    createBranch, 
    createRelease, 
    checkoutBranch, 
    mergeBranch, 
    deleteBranch, 
    status, 
    fetchRepo, 
    stashChanges, 
    applyStash, 
    resetChanges, 
    logCommits, 
    diffChanges 
};
`;

    fs.writeFileSync('./src/GitHub/GitHub.js', gitHubContent);
    console.log('GitHub.js mis à jour avec getCurrentBranch corrigé.');

    // Ajouter, committer et pousser avec les commandes Git directement pour cette étape
    console.log('Ajout des fichiers locaux...');
    execSync('git add .', { stdio: 'inherit' });
    
    console.log('Création du commit...');
    execSync('git commit -m "Correction de GitHub.js via UpdateProject.js" --allow-empty', { stdio: 'inherit' });
    
    console.log('Redémarrage pour appliquer les modifications...');
    // Créer un script temporaire pour terminer le push avec une syntaxe correcte
    fs.writeFileSync('restart.js', `
        const { execSync } = require('child_process');
        const fs = require('fs');
        const logStream = fs.createWriteStream('project.log', { flags: 'a' });
        const originalConsoleLog = console.log;
        console.log = (...args) => {
            logStream.write(args.join(' ') + '\\n');
            originalConsoleLog(...args);
        };
        console.log('Push vers GitHub après redémarrage...');
        const branch = fs.readFileSync('Branche.git', 'utf8').trim();
        execSync(\`git push origin \${branch}\`, { stdio: 'inherit' });
        console.log('UpdateProject.js terminé après redémarrage.');
        logStream.end();
    `);
    execSync('node restart.js', { stdio: 'inherit' });
    fs.unlinkSync('restart.js'); // Nettoyer le fichier temporaire
    
    // Restauration de la console
    logStream.end();
    console.log = originalConsoleLog;
}

updateProject();

module.exports = { updateProject };