const { execSync } = require('child_process');
const path = require('path');

const PROJECT_DIR = path.join(__dirname, '..', '..');

function checkToolInstalled(toolName) {
    try {
        execSync(`${toolName} --version`, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

function installChocolatey() {
    if (!checkToolInstalled('choco')) {
        console.log('Chocolatey non détecté, installation...');
        try {
            execSync('powershell -Command "Set-ExecutionPolicy Bypass -Scope CurrentUser; iwr https://chocolatey.org/install.ps1 -UseBasicParsing | iex"', { stdio: 'inherit' });
            console.log('Chocolatey installé avec succès.');
            process.env.PATH += ';C:\\ProgramData\\chocolatey\\bin';
            // Nettoie les fichiers de verrouillage potentiels
            const lockDir = 'C:\\ProgramData\\chocolatey\\lib';
            if (fs.existsSync(lockDir)) {
                fs.readdirSync(lockDir).forEach(file => {
                    const filePath = path.join(lockDir, file);
                    try {
                        fs.unlinkSync(filePath);
                    } catch (e) {
                        console.log(`Impossible de supprimer ${filePath} : ${e.message}`);
                    }
                });
            }
        } catch (error) {
            throw new Error(`Échec de l’installation de Chocolatey : ${error.message}`);
        }
    } else {
        console.log('Chocolatey déjà disponible.');
    }
}

function installGh() {
    if (!checkToolInstalled('gh')) {
        console.log('GitHub CLI (gh) non détecté, installation via Chocolatey...');
        installChocolatey();
        try {
            execSync('choco install gh -y', { stdio: 'inherit' });
            console.log('GitHub CLI (gh) installé avec succès.');
        } catch (error) {
            throw new Error(`Échec de l’installation de gh : ${error.message}`);
        }
    } else {
        console.log('GitHub CLI (gh) déjà disponible.');
    }
}

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
    installGh();
    execSync(`git tag ${tag}`, { cwd: PROJECT_DIR, stdio: 'inherit' });
    execSync(`git push origin ${tag}`, { cwd: PROJECT_DIR, stdio: 'inherit' });
    execSync(`gh release create ${tag} --title "${title}" --target ${branch} --notes "Release ${tag}"`, { cwd: PROJECT_DIR, stdio: 'inherit' });
}

module.exports = { addAll, commit, push, createRelease };
