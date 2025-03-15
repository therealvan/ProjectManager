const { execSync } = require('child_process');
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
    execSync(`git clone ${repoUrl} ${dir} || git -C ${dir} pull`, { stdio: 'inherit' });
}

function listLocalFiles() {
    return fs.readdirSync('.');
}

function addFiles(files) {
    execSync(`git add ${files}`, { stdio: 'inherit' });
}

function commitChanges(message) {
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
}

function pushChanges() {
    const branch = getCurrentBranch();
    try {
        // Mise à jour du README avant le push
        const { updateReadme } = require(path.join(__dirname, '..', '..', 'Readme.js'));
        updateReadme();
        
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (status.trim().length === 0) {
            console.log('Aucune modification locale à pousser.');
            return;
        }
        addFiles('.');
        try {
            commitChanges('Mise à jour automatique du projet');
        } catch (commitError) {
            console.log('Rien de nouveau à committer.');
        }
        execSync(`git push origin ${branch} --force`, { stdio: 'inherit' });
        console.log(`Code local poussé avec succès sur ${branch} (force).`);
    } catch (error) {
        console.error('Erreur lors du push :', error.message);
    }
}

function pullChanges() {
    const branch = getCurrentBranch();
    execSync(`git pull origin ${branch}`, { stdio: 'inherit' });
}

function createBranch(branchName) {
    const currentBranch = getCurrentBranch();
    try {
        execSync(`git push origin ${currentBranch}:${branchName}`, { stdio: 'inherit' });
        console.log(`Branche distante "${branchName}" créée avec succès depuis "${currentBranch}".`);
    } catch (error) {
        console.error(`Erreur lors de la création de la branche distante "${branchName}" : ${error.message}`);
    }
}

function createRelease(version) {
    execSync(`git tag ${version} && git push origin ${version}`, { stdio: 'inherit' });
}

function checkoutBranch(branchName) {
    execSync(`git checkout ${branchName}`, { stdio: 'inherit' });
}

function mergeBranch(branchName) {
    execSync(`git merge ${branchName}`, { stdio: 'inherit' });
}

function deleteBranch(branchName) {
    try {
        execSync(`git push origin --delete ${branchName}`, { stdio: 'inherit' });
        console.log(`Branche distante "${branchName}" supprimée avec succès.`);
    } catch (error) {
        console.error(`Erreur lors de la suppression de la branche distante "${branchName}" : ${error.message}`);
    }
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
