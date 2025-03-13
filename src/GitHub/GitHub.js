const { execSync } = require('child_process');
const path = require('path');

const PROJECT_DIR = path.join(__dirname, '..', '..');

function addAll() {
    execSync('git add .', { cwd: PROJECT_DIR, stdio: 'inherit' });
}

function commit(message) {
    execSync(`git commit -m "${message}"`, { cwd: PROJECT_DIR, stdio: 'inherit' });
}

function push(branch) {
    execSync(`git push origin ${branch}`, { cwd: PROJECT_DIR, stdio: 'inherit' });
}

function createRelease(tag, branch, title) {
    execSync(`git tag ${tag}`, { cwd: PROJECT_DIR, stdio: 'inherit' });
    execSync(`git push origin ${tag}`, { cwd: PROJECT_DIR, stdio: 'inherit' });
    execSync(`gh release create ${tag} --title "${title}" --target ${branch} --notes "Release ${tag}"`, { cwd: PROJECT_DIR, stdio: 'inherit' });
}

module.exports = { addAll, commit, push, createRelease };
