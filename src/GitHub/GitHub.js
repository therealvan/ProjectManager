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
        branchName = 'V1.0.0'; // Default branch
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
        // Call Readme.js to update README.md before pushing
        const { updateReadme } = require(path.join(__dirname, '..', '..', 'Readme.js'));
        updateReadme();
        
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (status.trim().length === 0) {
            console.log('No local changes to push.');
            return;
        }
        addFiles('.');
        try {
            commitChanges('Automatic project update');
        } catch (commitError) {
            console.log('Nothing new to commit.');
        }
        execSync(`git push origin ${branch} --force`, { stdio: 'inherit' });
        console.log(`Local code successfully pushed to ${branch} (force).`);
    } catch (error) {
        console.error('Error during push:', error.message);
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
        console.log(`Remote branch "${branchName}" successfully created from "${currentBranch}".`);
    } catch (error) {
        console.error(`Error creating remote branch "${branchName}": ${error.message}`);
    }
}

function createRelease(version) {
    execSync(`git tag ${version} && git push origin ${version}`, { stdio: 'inherit' });
}

function checkoutBranch(branchName) {
    try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        if (status.trim().length > 0) {
            execSync('git reset --hard', { stdio: 'inherit' });
            execSync('git clean -fd', { stdio: 'inherit' });
            console.log('All local uncommitted changes discarded.');
        }
        execSync('git fetch origin', { stdio: 'inherit' });
        execSync(`git checkout ${branchName}`, { stdio: 'inherit' });
        console.log(`Switched to branch ${branchName}`);
        fs.writeFileSync(path.join(__dirname, '..', '..', 'Branche.git'), branchName);
    } catch (error) {
        console.error(`Error switching to branch ${branchName}: ${error.message}`);
        throw error;
    }
}

function mergeBranch(branchName) {
    execSync(`git merge ${branchName}`, { stdio: 'inherit' });
}

function deleteBranch(branchName) {
    try {
        execSync(`git push origin --delete ${branchName}`, { stdio: 'inherit' });
        console.log(`Remote branch "${branchName}" successfully deleted.`);
    } catch (error) {
        console.error(`Error deleting remote branch "${branchName}": ${error.message}`);
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
