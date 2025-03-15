const fs = require('fs');
const path = require('path');

// Contenu mis à jour de GitHub.js (basé sur ton fichier actuel)
const updatedGithubJs = `const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function verifyGitSuccess() {
    try {
        execSync('git --version', { stdio: 'pipe' });
        return true;
    } catch (error) {
        return false;
    }
}

function getCurrentBranch() {
    const branchFile = path.join(__dirname, '..', '..', 'Branche.git');
    let branchName;
    try {
        branchName = fs.readFileSync(branchFile, 'utf8').trim();
    } catch (error) {
        branchName = 'V1.0.0'; // Branche par défaut
    }
    return branchName;
}

function cloneOrUpdateRepo(repoUrl, dir) {
    execSync(\`git clone \${repoUrl} \${dir} || git -C \${dir} pull\`, { stdio: 'inherit' });
}

function listLocalFiles() {
    return fs.readdirSync('.');
}

function addFiles(files) {
    execSync(\`git add \${files}\`, { stdio: 'inherit' });
}

function commitChanges(message) {
    execSync(\`git commit -m "\${message}"\`, { stdio: 'inherit' });
}

function pushChanges() {
    const branch = getCurrentBranch();
    addFiles('.');
    commitChanges('Mise à jour automatique du projet');
    execSync(\`git push origin \${branch}\`, { stdio: 'inherit' });
}

function pullChanges() {
    const branch = getCurrentBranch();
    execSync(\`git pull origin \${branch}\`, { stdio: 'inherit' });
}

function createBranch(branchName) {
    execSync(\`git checkout -b \${branchName}\`, { stdio: 'inherit' });
}

function createRelease(version) {
    execSync(\`git tag \${version} && git push origin \${version}\`, { stdio: 'inherit' });
}

function checkoutBranch(branchName) {
    execSync(\`git checkout \${branchName}\`, { stdio: 'inherit' });
}

function mergeBranch(branchName) {
    execSync(\`git merge \${branchName}\`, { stdio: 'inherit' });
}

function deleteBranch(branchName) {
    execSync(\`git branch -d \${branchName}\`, { stdio: 'inherit' });
}

function status() {
    execSync('git status', { stdio: 'inherit' });
}

function fetchRepo() {
    execSync('git fetch', { stdio: 'inherit' });
}

function stashChanges() {
    execSync('git stash', { stdio: 'inherit' });
}

function applyStash() {
    execSync('git stash pop', { stdio: 'inherit' });
}

function resetChanges() {
    execSync('git reset --hard', { stdio: 'inherit' });
}

function logCommits() {
    execSync('git log', { stdio: 'inherit' });
}

function diffChanges() {
    execSync('git diff', { stdio: 'inherit' });
}

module.exports = {
    verifyGitSuccess, getCurrentBranch, cloneOrUpdateRepo, listLocalFiles,
    addFiles, commitChanges, pushChanges, pullChanges, createBranch,
    createRelease, checkoutBranch, mergeBranch, deleteBranch, status,
    fetchRepo, stashChanges, applyStash, resetChanges, logCommits, diffChanges
};
`;

// Écriture du nouveau GitHub.js
fs.writeFileSync(path.join(__dirname, 'src', 'GitHub', 'GitHub.js'), updatedGithubJs);
console.log('GitHub.js modifié avec succès.');

// Chargement de GitHub.js pour appeler ses fonctions
const github = require('./src/GitHub/GitHub.js');

// Redirection des sorties vers project.log
const logStream = fs.createWriteStream(path.join(__dirname, 'project.log'), { flags: 'a' });
console.log = (...args) => logStream.write(args.join(' ') + '\n');

if (!fs.existsSync(path.join(__dirname, 'project.log'))) {
    fs.writeFileSync(path.join(__dirname, 'project.log'), '');
}

// Appel explicite de pushChanges
console.log('Début du push...');
github.pushChanges();
console.log('Push terminé avec succès.');