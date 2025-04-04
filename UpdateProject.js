const fs = require('fs');
const path = require('path');

function updateProject() {
    console.log('Starting UpdateProject.js...');
    console.log('-------------');

    // Contenu des fichiers avec échappement correct
    const githubContent = `
const path = require('path');

const REPO_URL = 'https://github.com/therealvan/ProjectManager.git';
const PROJECT_DIR = path.join(__dirname);

module.exports = { REPO_URL, PROJECT_DIR };
`;

    const gitCheckContent = `
const { execSync } = require('child_process');

function checkGit() {
    try {
        console.log('Checking Git...');
        execSync('git --version', { stdio: 'inherit' });
        console.log('Git OK.');
        return true;
    } catch (error) {
        console.error('Error - Git is not installed or inaccessible:', error.message);
        console.log('Please install Git manually or via npm.');
        return false;
    }
}

module.exports = { checkGit };
`;

    const gitCloneContent = `
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { PROJECT_DIR, REPO_URL } = require('./GitHub.js');

function cloneToRoot(branch = 'V1.0.0') {
    try {
        console.log('Starting cloning to root...');
        const tempDir = path.join(PROJECT_DIR, 'temp_repo');
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
        execSync('git clone -b ' + branch + ' ' + REPO_URL + ' ' + tempDir, { stdio: 'inherit' });
        const tempFiles = fs.readdirSync(tempDir);
        for (const file of tempFiles) {
            if (file !== '.git') {
                fs.renameSync(path.join(tempDir, file), path.join(PROJECT_DIR, file));
            }
        }
        fs.renameSync(path.join(tempDir, '.git'), path.join(PROJECT_DIR, '.git'));
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log('Repository successfully cloned to root on branch ' + branch + '.');
        return true;
    } catch (error) {
        console.error('Error during cloning:', error.message);
        throw error;
    }
}

module.exports = { cloneToRoot };
`;

    const gitBranchContent = `
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { PROJECT_DIR } = require('./GitHub.js');

function getCurrentBranch() {
    try {
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { 
            encoding: 'utf8', 
            cwd: PROJECT_DIR 
        }).trim();
        console.log('Current branch: ' + branch);
        return branch;
    } catch (error) {
        console.error('Error getting current branch:', error.message);
        throw error;
    }
}

function saveCurrentBranch() {
    try {
        const branch = getCurrentBranch();
        fs.writeFileSync(path.join(PROJECT_DIR, 'Branche.git'), branch);
        console.log('Active branch (' + branch + ') written to Branche.git');
        return branch;
    } catch (error) {
        console.error('Error saving branch:', error.message);
        throw error;
    }
}

function createBranch(branchName) {
    try {
        execSync('git branch ' + branchName, { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Branch ' + branchName + ' created');
        return true;
    } catch (error) {
        console.error('Error creating branch ' + branchName + ':', error.message);
        throw error;
    }
}

function switchBranch(branchName) {
    try {
        execSync('git checkout ' + branchName, { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Switched to branch ' + branchName);
        saveCurrentBranch();
        return true;
    } catch (error) {
        console.error('Error switching to branch ' + branchName + ':', error.message);
        throw error;
    }
}

module.exports = { getCurrentBranch, saveCurrentBranch, createBranch, switchBranch };
`;

    const gitCommitContent = `
const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');

function addFiles(files = '.') {
    try {
        execSync('git add ' + files, { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Files added to staging: ' + files);
        return true;
    } catch (error) {
        console.error('Error adding files:', error.message);
        throw error;
    }
}

function commit(message = 'Update') {
    try {
        execSync('git commit -m "' + message + '"', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Committed with message: "' + message + '"');
        return true;
    } catch (error) {
        console.error('Error committing:', error.message);
        throw error;
    }
}

module.exports = { addFiles, commit };
`;

    const gitPushContent = `
const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');
const { getCurrentBranch } = require('./GitBranch.js');

function push(branch = getCurrentBranch(), force = false) {
    try {
        const forceFlag = force ? ' --force' : '';
        execSync('git push origin ' + branch + forceFlag, { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Pushed to ' + branch + (force ? ' (forced)' : ''));
        return true;
    } catch (error) {
        console.error('Error pushing:', error.message);
        throw error;
    }
}

module.exports = { push };
`;

    const gitPullContent = `
const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');
const { getCurrentBranch } = require('./GitBranch.js');

function pull(branch = getCurrentBranch()) {
    try {
        execSync('git pull origin ' + branch, { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Pulled from ' + branch);
        return true;
    } catch (error) {
        console.error('Error pulling:', error.message);
        throw error;
    }
}

module.exports = { pull };
`;

    const gitStatusContent = `
const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');

function status() {
    try {
        execSync('git status', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Repository status displayed');
        return true;
    } catch (error) {
        console.error('Error checking status:', error.message);
        throw error;
    }
}

module.exports = { status };
`;

    const gitResetContent = `
const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');

function resetHard() {
    try {
        execSync('git reset --hard', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Repository reset to last commit');
        return true;
    } catch (error) {
        console.error('Error resetting:', error.message);
        throw error;
    }
}

function clean() {
    try {
        execSync('git clean -fd', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Untracked files and directories removed');
        return true;
    } catch (error) {
        console.error('Error cleaning:', error.message);
        throw error;
    }
}

module.exports = { resetHard, clean };
`;

    const gitTagContent = `
const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');

function createTag(tagName) {
    try {
        execSync('git tag ' + tagName, { stdio: 'inherit', cwd: PROJECT_DIR });
        execSync('git push origin ' + tagName, { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Tag ' + tagName + ' created and pushed');
        return true;
    } catch (error) {
        console.error('Error creating tag:', error.message);
        throw error;
    }
}

module.exports = { createTag };
`;

    const gitMergeContent = `
const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');

function merge(branchName) {
    try {
        execSync('git merge ' + branchName, { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Merged branch ' + branchName);
        return true;
    } catch (error) {
        console.error('Error merging branch ' + branchName + ':', error.message);
        throw error;
    }
}

module.exports = { merge };
`;

    const gitStashContent = `
const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');

function stash() {
    try {
        execSync('git stash', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Changes stashed');
        return true;
    } catch (error) {
        console.error('Error stashing:', error.message);
        throw error;
    }
}

function stashPop() {
    try {
        execSync('git stash pop', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Stash applied');
        return true;
    } catch (error) {
        console.error('Error popping stash:', error.message);
        throw error;
    }
}

module.exports = { stash, stashPop };
`;

    const gitLogContent = `
const { execSync } = require('child_process');
const { PROJECT_DIR } = require('./GitHub.js');

function log() {
    try {
        execSync('git log --oneline', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Commit history displayed');
        return true;
    } catch (error) {
        console.error('Error displaying log:', error.message);
        throw error;
    }
}

module.exports = { log };
`;

    // Écriture des fichiers
    const files = [
        { name: 'GitHub.js', content: githubContent },
        { name: 'GitCheck.js', content: gitCheckContent },
        { name: 'GitClone.js', content: gitCloneContent },
        { name: 'GitBranch.js', content: gitBranchContent },
        { name: 'GitCommit.js', content: gitCommitContent },
        { name: 'GitPush.js', content: gitPushContent },
        { name: 'GitPull.js', content: gitPullContent },
        { name: 'GitStatus.js', content: gitStatusContent },
        { name: 'GitReset.js', content: gitResetContent },
        { name: 'GitTag.js', content: gitTagContent },
        { name: 'GitMerge.js', content: gitMergeContent },
        { name: 'GitStash.js', content: gitStashContent },
        { name: 'GitLog.js', content: gitLogContent }
    ];

    for (const file of files) {
        try {
            fs.writeFileSync(path.join(__dirname, file.name), file.content.trim());
            console.log(`${file.name} created successfully`);
        } catch (error) {
            console.error(`Error creating ${file.name}:`, error.message);
        }
    }

    console.log('-------------');
    console.log('Update complete! All Git management files created.');
}

try {
    updateProject();
} catch (error) {
    console.error('Error in UpdateProject.js:', error.message);
}

module.exports = { updateProject };