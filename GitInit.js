const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { PROJECT_DIR } = require('./GitHub.js');

function initDependencies() {
    console.log('Initializing project dependencies...');

    // Vérifier si package.json existe, sinon le créer
    const packageJsonPath = path.join(PROJECT_DIR, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        console.log('Creating package.json...');
        try {
            execSync('npm init -y', { stdio: 'inherit', cwd: PROJECT_DIR });
            console.log('package.json created successfully');
        } catch (error) {
            console.error('Error creating package.json:', error.message);
            throw error;
        }
    } else {
        console.log('package.json already exists');
    }

    // Désinstaller toute version existante de chalk
    console.log('Uninstalling any existing version of chalk...');
    try {
        execSync('npm uninstall chalk', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('Existing chalk uninstalled successfully');
    } catch (error) {
        console.log('No previous version of chalk to uninstall or error ignored');
    }

    // Installer chalk@4.1.2
    console.log('Installing chalk@4.1.2...');
    try {
        execSync('npm install chalk@4.1.2', { stdio: 'inherit', cwd: PROJECT_DIR });
        console.log('chalk@4.1.2 installed successfully');
    } catch (error) {
        console.error('Error installing chalk@4.1.2:', error.message);
        throw error;
    }

    // Vérifier et installer progress si nécessaire
    const nodeModulesPath = path.join(PROJECT_DIR, 'node_modules');
    const progressPath = path.join(nodeModulesPath, 'progress');
    if (!fs.existsSync(progressPath)) {
        console.log('Installing progress...');
        try {
            execSync('npm install progress', { stdio: 'inherit', cwd: PROJECT_DIR });
            console.log('progress installed successfully');
        } catch (error) {
            console.error('Error installing progress:', error.message);
            throw error;
        }
    } else {
        console.log('progress is already installed');
    }

    // Vérifier si Git est installé
    try {
        execSync('git --version', { stdio: 'inherit' });
        console.log('Git is installed');
    } catch (error) {
        console.error('Git is not installed. Please install Git manually from https://git-scm.com/');
        throw error;
    }

    console.log('All dependencies initialized successfully!');
}

module.exports = { initDependencies };