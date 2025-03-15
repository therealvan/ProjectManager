// UpdateProject.js
const fs = require('fs');
const path = require('path');

// Path to GitHub.js
const githubPath = path.join(__dirname, 'src', 'GitHub', 'GitHub.js');

// New content for GitHub.js with modified pushChanges
const newGithubContent = `const { execSync } = require('child_process');
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

function pushChanges(branch = getCurrentBranch()) {
    try {
        // Update Branche.git with the current branch before pushing
        const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
        fs.writeFileSync(path.join(__dirname, '..', '..', 'Branche.git'), currentBranch);
        console.log(\`Branche.git updated to: \${currentBranch}\`);

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
        execSync(\`git push origin \${branch} --force\`, { stdio: 'inherit' });
        console.log(\`Local code successfully pushed to \${branch} (force).\`);
    } catch (error) {
        console.error('Error during push:', error.message);
    }
}

function pullChanges() {
    const branch = getCurrentBranch();
    execSync(\`git pull origin \${branch}\`, { stdio: 'inherit' });
}

function createBranch(branchName) {
    const currentBranch = getCurrentBranch();
    try {
        execSync(\`git push origin \${currentBranch}:\${branchName}\`, { stdio: 'inherit' });
        console.log(\`Remote branch "\${branchName}" successfully created from "\${currentBranch}".\`);
    } catch (error) {
        console.error(\`Error creating remote branch "\${branchName}": \${error.message}\`);
    }
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
    try {
        execSync(\`git push origin --delete \${branchName}\`, { stdio: 'inherit' });
        console.log(\`Remote branch "\${branchName}" successfully deleted.\`);
    } catch (error) {
        console.error(\`Error deleting remote branch "\${branchName}": \${error.message}\`);
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
`;

// Write the modified GitHub.js
fs.writeFileSync(githubPath, newGithubContent);
console.log('GitHub.js modified to update Branche.git before pushing.');

// Push to the current branch
const { pushChanges } = require('./src/GitHub/GitHub.js');
pushChanges();