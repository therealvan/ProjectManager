const fs = require('fs');

function updateProject() {
    console.log('Lancement de UpdateProject.js...');
    
    // Redirection des sorties vers project.log
    const logStream = fs.createWriteStream('project.log', { flags: 'a' });
    const originalConsoleLog = console.log;
    console.log = (...args) => {
        logStream.write(args.join(' ') + '\n');
        originalConsoleLog(...args);
    };

    // Contenu modifié de GitHub.js avec vérifications
    const gitHubContent = `// GitHub.js - Module pour interagir avec GitHub
const { execSync } = require('child_process');
const fs = require('fs');

function verifyGitSuccess(commandOutput, successMessage) {
    if (commandOutput && commandOutput.includes('fatal')) {
        throw new Error('Échec de l’opération Git : ' + commandOutput);
    }
    console.log(successMessage);
}

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
            const output = execSync(\`git clone -b \${branch} \${repoUrl} .\`, { stdio: 'inherit', encoding: 'utf8' });
            verifyGitSuccess(output, 'Dépôt cloné avec succès à la racine.');
        } else {
            console.log('Mise à jour du dépôt à la racine...');
            let output = execSync('git fetch origin', { stdio: 'inherit', encoding: 'utf8' });
            verifyGitSuccess(output, 'Fetch effectué avec succès.');
            output = execSync(\`git checkout \${branch}\`, { stdio: 'inherit', encoding: 'utf8' });
            verifyGitSuccess(output, 'Checkout de la branche effectué avec succès.');
            output = execSync(\`git pull origin \${branch}\`, { stdio: 'inherit', encoding: 'utf8' });
            verifyGitSuccess(output, 'Dépôt mis à jour avec succès à la racine.');
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
        console.log('Ajout des fichiers à l’index...');
        const output = execSync(\`git add \${pattern}\`, { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Fichiers ajoutés à l’index.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de l’ajout des fichiers : " + error.message);
        throw error;
    }
}

function commitChanges(message) {
    try {
        console.log('Création du commit...');
        const output = execSync(\`git commit -m "\${message}" --allow-empty\`, { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Commit créé avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du commit : " + error.message);
        throw error;
    }
}

function pushChanges(branch) {
    try {
        console.log('Poussée des modifications vers GitHub...');
        const output = execSync(\`git push origin \${branch}\`, { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Modifications poussées avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du push : " + error.message);
        throw error;
    }
}

function pullChanges(branch) {
    try {
        console.log('Tirage des modifications depuis GitHub...');
        const output = execSync(\`git pull origin \${branch}\`, { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Modifications tirées avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du pull : " + error.message);
        throw error;
    }
}

function createBranch(branchName) {
    try {
        console.log('Création de la branche...');
        let output = execSync(\`git checkout -b \${branchName}\`, { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Branche \${branchName} créée localement.');
        output = execSync(\`git push origin \${branchName}\`, { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Branche \${branchName} poussée avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la création de la branche : " + error.message);
        throw error;
    }
}

function createRelease(version, message) {
    try {
        console.log('Création de la release...');
        let output = execSync(\`git tag \${version}\`, { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Tag \${version} créé avec succès.');
        output = execSync(\`git push origin \${version}\`, { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Release \${version} poussée avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la création de la release : " + error.message);
        throw error;
    }
}

function checkoutBranch(branch) {
    try {
        console.log('Checkout de la branche...');
        const output = execSync(\`git checkout \${branch}\`, { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Branche \${branch} checkout avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du checkout : " + error.message);
        throw error;
    }
}

function mergeBranch(sourceBranch, targetBranch) {
    try {
        console.log('Fusion des branches...');
        let output = execSync(\`git checkout \${targetBranch}\`, { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Checkout de \${targetBranch} réussi.');
        output = execSync(\`git merge \${sourceBranch}\`, { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Fusion de \${sourceBranch} dans \${targetBranch} réussie.');
        output = execSync(\`git push origin \${targetBranch}\`, { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Modifications poussées après fusion.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la fusion : " + error.message);
        throw error;
    }
}

function deleteBranch(branch, remote = false) {
    try {
        if (remote) {
            console.log('Suppression de la branche distante...');
            const output = execSync(\`git push origin --delete \${branch}\`, { stdio: 'inherit', encoding: 'utf8' });
            verifyGitSuccess(output, 'Branche distante \${branch} supprimée.');
        } else {
            console.log('Suppression de la branche locale...');
            const output = execSync(\`git branch -D \${branch}\`, { stdio: 'inherit', encoding: 'utf8' });
            verifyGitSuccess(output, 'Branche locale \${branch} supprimée.');
        }
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de la suppression de la branche : " + error.message);
        throw error;
    }
}

function status() {
    try {
        console.log('Vérification de l’état du dépôt...');
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
        console.log('Fetch du dépôt...');
        const output = execSync('git fetch origin', { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Dépôt fetch avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du fetch : " + error.message);
        throw error;
    }
}

function stashChanges() {
    try {
        console.log('Stash des changements...');
        const output = execSync('git stash', { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Changements stashés avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du stash : " + error.message);
        throw error;
    }
}

function applyStash(index = 0) {
    try {
        console.log('Application du stash...');
        const output = execSync(\`git stash apply stash{\${index}}\`, { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Stash \${index} appliqué avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors de l’application du stash : " + error.message);
        throw error;
    }
}

function resetChanges(hard = false) {
    try {
        console.log('Reset des changements...');
        const mode = hard ? '--hard' : '--soft';
        const output = execSync(\`git reset \${mode}\`, { stdio: 'inherit', encoding: 'utf8' });
        verifyGitSuccess(output, 'Reset des changements effectué avec succès.');
    } catch (error) {
        const debug = require('./DiagGitHub.js');
        debug.log("Erreur lors du reset : " + error.message);
        throw error;
    }
}

function logCommits(limit = 10) {
    try {
        console.log('Récupération des commits...');
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
        console.log('Récupération des différences...');
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
    console.log('GitHub.js mis à jour avec vérifications après chaque action.');

    // Chargement du module mis à jour après vidage du cache
    delete require.cache[require.resolve('./src/GitHub/GitHub.js')];
    const { addFiles, commitChanges, pushChanges, getCurrentBranch } = require('./src/GitHub/GitHub.js');

    console.log('Ajout des fichiers locaux...');
    addFiles('.');
    
    console.log('Création du commit...');
    commitChanges('Mise à jour de GitHub.js avec vérifications');
    
    console.log('Push vers GitHub...');
    const branch = getCurrentBranch();
    pushChanges(branch);
    
    console.log('UpdateProject.js terminé.');
    
    // Restauration de la console
    logStream.end();
    console.log = originalConsoleLog;
}

updateProject();

module.exports = { updateProject };