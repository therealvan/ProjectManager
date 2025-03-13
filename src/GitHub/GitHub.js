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
    // Note : La création d'une release GitHub nécessite l'API GitHub ou gh CLI. Ici, on utilise une approximation avec un tag.
    execSync(`gh release create ${tag} --title "${title}" --target ${branch} --notes "Release ${tag}"`, { cwd: PROJECT_DIR, stdio: 'inherit' });
}

module.exports = { addAll, commit, push, createRelease };
