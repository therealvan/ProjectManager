const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_URL = 'https://github.com/therealvan/ProjectManager.git';
const PROJECT_DIR = path.join(__dirname);

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startProject() {
    console.log('Starting StartProject.js...');
    console.log('-------------');

    try {
        console.log('Checking Git...');
        execSync('git --version', { stdio: 'inherit' });
        console.log('Step 1: Git OK.');
    } catch (error) {
        console.error('Step 1: Error - Git is not installed or inaccessible:', error.message);
        console.log('Please install Git manually or via npm.');
        return;
    }
    console.log('-------------');

    try {
        console.log('Checking and cleaning main directory:', PROJECT_DIR);
        if (!fs.existsSync(PROJECT_DIR)) {
            fs.mkdirSync(PROJECT_DIR, { recursive: true });
            console.log('ProjectManager directory created.');
        }
        const files = fs.readdirSync(PROJECT_DIR);
        for (const file of files) {
            if (file !== 'StartProject.js' && file !== 'UpdateProject.js') {
                const filePath = path.join(PROJECT_DIR, file);
                let retries = 3;
                while (retries > 0) {
                    try {
                        if (fs.lstatSync(filePath).isDirectory()) {
                            fs.rmSync(filePath, { recursive: true, force: true });
                        } else {
                            fs.unlinkSync(filePath);
                        }
                        break;
                    } catch (err) {
                        if (err.code === 'EBUSY') {
                            console.log(`File ${file} locked, waiting 1s...`);
                            await delay(1000);
                            retries--;
                            if (retries === 0) throw err;
                        } else {
                            throw err;
                        }
                    }
                }
            }
        }
        console.log('Step 2: Directory cleaned, only StartProject.js and UpdateProject.js remain.');
        process.chdir(PROJECT_DIR);
        console.log('Working directory changed to:', process.cwd());
    } catch (error) {
        console.error('Step 2: Error during cleaning or directory preparation:', error.message);
        return;
    }
    console.log('-------------');

    try {
        console.log('Starting cloning to root...');
        const tempDir = path.join(PROJECT_DIR, 'temp_repo');
        if (fs.existsSync(tempDir)) {
            let retries = 3;
            while (retries > 0) {
                try {
                    fs.rmSync(tempDir, { recursive: true, force: true });
                    break;
                } catch (err) {
                    if (err.code === 'EBUSY') {
                        console.log('temp_repo directory locked, waiting 1s...');
                        await delay(1000);
                        retries--;
                        if (retries === 0) throw err;
                    } else {
                        throw err;
                    }
                }
            }
        }
        execSync(`git clone -b V1.0.0 ${REPO_URL} ${tempDir}`, { stdio: 'inherit' });
        const tempFiles = fs.readdirSync(tempDir);
        for (const file of tempFiles) {
            if (file !== '.git') {
                let retries = 3;
                while (retries > 0) {
                    try {
                        fs.renameSync(path.join(tempDir, file), path.join(PROJECT_DIR, file));
                        break;
                    } catch (err) {
                        if (err.code === 'EBUSY') {
                            console.log(`File ${file} locked, waiting 1s...`);
                            await delay(1000);
                            retries--;
                            if (retries === 0) throw err;
                        } else {
                            throw err;
                        }
                    }
                }
            }
        }
        fs.renameSync(path.join(tempDir, '.git'), path.join(PROJECT_DIR, '.git'));
        fs.rmSync(tempDir, { recursive: true, force: true });
        console.log('Step 3: Repository successfully cloned to root on branch V1.0.0.');
    } catch (error) {
        console.error('Step 3: Error during cloning:', error.message);
        return;
    }
    console.log('-------------');

    try {
        console.log('Checking local files at root...');
        const files = fs.readdirSync('.', { withFileTypes: true });
        const fileList = files.map(item => item.isDirectory() ? item.name + '/' : item.name);
        console.log('Local files after cloning:', fileList);
        console.log('Step 4: Local content verified.');
    } catch (error) {
        console.error('Step 4: Error during verification:', error.message);
        return;
    }
    console.log('-------------');

    try {
        console.log('Launching ProjectTree.js...');
        const arborescence = require(path.join(PROJECT_DIR, 'ProjectTree.js'));
        arborescence.generateTree();
        console.log('Step 5: ProjectTree.js executed successfully.');
    } catch (error) {
        console.error('Step 5: Error executing ProjectTree.js:', error.message);
    }
    console.log('-------------');

    try {
        console.log('Executing Fonctions.js...');
        const fonctions = require(path.join(PROJECT_DIR, 'Fonctions.js'));
        fonctions.listFunctionsInJsFiles();
    } catch (error) {
        console.error('Error executing Fonctions.js:', error.message);
    }

    try {
        console.log('Final launch of ProjectTree.js...');
        const arborescence = require(path.join(PROJECT_DIR, 'ProjectTree.js'));
        arborescence.generateTree();
    } catch (error) {
        console.error('Error during final execution of ProjectTree.js:', error.message);
    }

    console.log('Finished!');

    try {
        console.log('Retrieving active branch...');
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
        fs.writeFileSync('Branche.git', branch);
        console.log('Active branch (' + branch + ') written to Branche.git.');
    } catch (error) {
        console.error('Error retrieving branch:', error.message);
    }
}

try {
    console.log('Attempting to execute startProject...');
    startProject().catch(err => console.error('Global error in StartProject.js:', err.message));
} catch (error) {
    console.error('Global error in StartProject.js:', error.message);
}

module.exports = { startProject };
