const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PROJECT_DIR = path.join(__dirname, '..', '..');
const debug = require('../GitHub/DiagGitHub.js');
const diagHttp = require('./DiagHttpServer.js');

function checkToolInstalled(toolName) {
    try {
        execSync(`${toolName} --version`, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

function installNode() {
    if (!checkToolInstalled('node')) {
        diagHttp.log('Node.js non détecté, installation via Chocolatey...');
        installChocolatey();
        execSync('choco install nodejs -y', { stdio: 'inherit' });
        diagHttp.log('Node.js installé avec succès.');
    } else {
        diagHttp.log('Node.js déjà disponible.');
    }
}

function installNpm() {
    if (!checkToolInstalled('npm')) {
        diagHttp.log('npm non détecté, installation via Chocolatey...');
        installChocolatey();
        execSync('choco install npm -y', { stdio: 'inherit' });
        diagHttp.log('npm installé avec succès.');
    } else {
        diagHttp.log('npm déjà disponible.');
    }
}

function installChocolatey() {
    const chocoPath = 'C:\\ProgramData\\chocolatey';
    let reinstall = false;
    if (fs.existsSync(chocoPath) && !checkToolInstalled('choco')) {
        diagHttp.log('Chocolatey semble corrompu, réinstallation...');
        fs.rmSync(chocoPath, { recursive: true, force: true });
        reinstall = true;
    }
    if (!checkToolInstalled('choco') || reinstall) {
        diagHttp.log('Installation de Chocolatey...');
        try {
            execSync('powershell -Command "Set-ExecutionPolicy Bypass -Scope CurrentUser; iwr https://chocolatey.org/install.ps1 -UseBasicParsing | iex"', { stdio: 'inherit' });
            diagHttp.log('Chocolatey installé avec succès.');
            process.env.PATH += ';C:\\ProgramData\\chocolatey\\bin';
        } catch (error) {
            diagHttp.log(`Échec de l’installation de Chocolatey : ${error.message}`);
            throw new Error('Chocolatey requis pour installer les dépendances.');
        }
    } else {
        diagHttp.log('Chocolatey déjà disponible.');
    }
}

function installOpenSSL() {
    if (!checkToolInstalled('openssl')) {
        diagHttp.log('OpenSSL non détecté, installation via Chocolatey...');
        installChocolatey();
        try {
            execSync('choco install openssl -y', { stdio: 'inherit' });
            diagHttp.log('OpenSSL installé avec succès.');
        } catch (error) {
            diagHttp.log(`Échec de l’installation d’OpenSSL : ${error.message}`);
            throw new Error('OpenSSL requis pour HTTPS.');
        }
    } else {
        diagHttp.log('OpenSSL déjà disponible.');
    }
}

function trustCertificate(certPath) {
    try {
        diagHttp.log('Ajout du certificat au magasin de certificats Windows...');
        execSync(`certutil -addstore -f "Root" "${certPath}"`, { stdio: 'inherit' });
        diagHttp.log('Certificat approuvé avec succès.');
    } catch (error) {
        diagHttp.log(`Échec de l’approbation du certificat : ${error.message}. Vous devrez peut-être accepter manuellement l’avertissement.`);
    }
}

function generateSelfSignedCert() {
    installOpenSSL();
    const certDir = path.join(PROJECT_DIR, 'certs');
    const keyPath = path.join(certDir, 'server.key');
    const certPath = path.join(certDir, 'server.crt');
    if (!fs.existsSync(certDir)) {
        fs.mkdirSync(certDir, { recursive: true });
    }
    diagHttp.log('Génération d’un certificat auto-signé pour localhost et 10.0.2.10...');
    execSync(`openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 -subj "/C=FR/ST=State/L=City/O=Project/CN=localhost" -addext "subjectAltName = DNS:localhost, IP:10.0.2.10" -keyout "${keyPath}" -out "${certPath}"`, { stdio: 'inherit' });
    diagHttp.log('Certificat auto-signé généré.');
    trustCertificate(certPath);
    return { keyPath, certPath };
}

function installHttpServer() {
    const localServerPath = path.join(PROJECT_DIR, 'node_modules', '.bin', 'http-server');
    if (!checkToolInstalled('http-server') && !fs.existsSync(localServerPath)) {
        diagHttp.log('Installation de http-server...');
        installNpm();
        try {
            execSync('npm install -g http-server', { stdio: 'inherit' });
            diagHttp.log('http-server installé globalement avec succès.');
        } catch (error) {
            diagHttp.log('Échec de l’installation globale, tentative locale...');
            execSync('npm install http-server --save-dev', { cwd: PROJECT_DIR, stdio: 'inherit' });
            diagHttp.log('http-server installé localement.');
        }
    } else {
        diagHttp.log('http-server déjà disponible.');
    }
    return fs.existsSync(localServerPath) ? localServerPath : 'http-server';
}

function isServerRunning(port) {
    try {
        execSync(`netstat -a -n -o | find ":${port}"`, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

function getDefaultBrowserWin11() {
    const browsers = {
        'chrome': 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'edge': 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'firefox': 'C:\\Program Files\\Mozilla Firefox\\firefox.exe'
    };
    for (const [name, browserPath] of Object.entries(browsers)) {
        if (fs.existsSync(browserPath)) {
            diagHttp.log(`Navigateur par défaut détecté : ${name}`);
            return browserPath;
        }
    }
    throw new Error('Aucun navigateur par défaut trouvé.');
}

function cleanTempDir(tempDir, browserProcess) {
    if (browserProcess && !browserProcess.killed) {
        diagHttp.log('Tentative de fermeture du processus du navigateur spécifique...');
        try {
            process.kill(browserProcess.pid);
            diagHttp.log('Processus du navigateur fermé.');
        } catch (error) {
            diagHttp.log(`Erreur lors de la fermeture du processus : ${error.message}`);
        }
    }
    let retries = 3; // Retour à 3 tentatives
    while (retries > 0) {
        try {
            fs.rmSync(tempDir, { recursive: true, force: true });
            diagHttp.log('Dossier temporaire supprimé.');
            break;
        } catch (error) {
            if (error.code === 'EBUSY') {
                diagHttp.log(`Dossier temporaire verrouillé, nouvelle tentative dans 2s...`);
                require('child_process').execSync('ping 127.0.0.1 -n 3 >nul', { stdio: 'ignore' }); // Retour à 2s
                retries--;
                if (retries === 0) throw new Error(`Erreur lors du nettoyage : ${error.message}`);
            } else {
                debug.log(`Erreur inattendue lors du nettoyage : ${error.message}`);
                break;
            }
        }
    }
}

function startHttpServer() {
    diagHttp.log('Début de la préparation du serveur HTTPS...');
    installNode(); // Assure que Node.js est prêt
    const serverPath = installHttpServer();
    const { keyPath, certPath } = generateSelfSignedCert();
    const tempDir = path.join(os.tmpdir(), `projectmanager-${Date.now()}`);
    fs.mkdirSync(tempDir, { recursive: true });
    const faviconPath = path.join(PROJECT_DIR, 'favicon.ico');
    if (!fs.existsSync(faviconPath)) {
        fs.writeFileSync(faviconPath, '');
        diagHttp.log('Fichier favicon.ico créé.');
    }
    let serverProcess, browserProcess;
    try {
        diagHttp.log('Démarrage du serveur HTTPS sur le port 8080...');
        serverProcess = spawn(serverPath, ['.', '-p', '8080', '-S', '-C', certPath, '-K', keyPath], { cwd: PROJECT_DIR, detached: true, stdio: 'ignore', shell: true });
        serverProcess.on('error', (err) => {
            debug.log(`Erreur lors du démarrage du serveur : ${err.message}`);
            throw err;
        });
        serverProcess.unref();
        let retries = 10;
        let delayMs = 1000;
        while (retries > 0 && !isServerRunning(8080)) {
            diagHttp.log('Attente du démarrage du serveur...');
            require('child_process').execSync('ping 127.0.0.1 -n 2 >nul', { stdio: 'ignore' });
            retries--;
            delayMs += 500;
        }
        if (!isServerRunning(8080)) throw new Error('Le serveur HTTPS ne répond pas après plusieurs tentatives.');
        diagHttp.log('Serveur HTTPS démarré avec succès.');

        const browserPath = getDefaultBrowserWin11();
        const browserArgs = ['--user-data-dir=' + tempDir, '--enable-webgpu', 'https://10.0.2.10:8080'];
        diagHttp.log('Lancement du navigateur...');
        browserProcess = spawn(`"${browserPath}"`, browserArgs, { shell: true, detached: false, stdio: 'ignore' });
        browserProcess.on('error', (err) => {
            debug.log(`Erreur lors du lancement du navigateur : ${err.message}`);
            throw err;
        });
        diagHttp.log('Navigateur lancé avec succès (PID: ' + browserProcess.pid + ').');

        // Nettoyage différé
        setTimeout(() => cleanTempDir(tempDir, browserProcess), 5000); // Retour à 5s

        // Maintien du processus actif
        diagHttp.log('Serveur en cours d’exécution. Maintien du processus actif...');
        process.stdin.resume(); // Empêche la fermeture immédiate
    } catch (error) {
        debug.log(`Erreur dans startHttpServer : ${error.message}`);
        if (serverProcess && !serverProcess.killed) process.kill(serverProcess.pid);
        cleanTempDir(tempDir, browserProcess);
        throw error;
    }
}

module.exports = { startHttpServer };
