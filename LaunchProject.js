const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const http = require('http');
const { getSystemInfo } = require('./src/Tools/System/GetSystemInfo.js');

const PROJECT_DIR = path.join(__dirname);
const LOG_FILE = path.join(PROJECT_DIR, 'project.log');
const TOOLS_DIR = path.join(PROJECT_DIR, 'src', 'Tools');

function logToFile(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`, 'utf8');
    console.log(message);
}

// Check if a port is in use
function isPortInUse(port) {
    try {
        const result = execSync(`netstat -aon | findstr :${port}`, { stdio: 'pipe' }).toString().trim();
        return result.length > 0;
    } catch {
        return false;
    }
}

// Launch system info server if port is free
const SYSTEM_PORT = 3000;
if (isPortInUse(SYSTEM_PORT)) {
    logToFile(`Port ${SYSTEM_PORT} already in use, skipping system info server startup`);
} else {
    const server = http.createServer((req, res) => {
        if (req.url === '/system-info' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
            res.end(JSON.stringify(getSystemInfo()));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
        }
    });

    server.on('error', (err) => {
        logToFile(`System info server error: ${err.message}`);
    });

    server.listen(SYSTEM_PORT, () => {
        logToFile(`System info server running on port ${SYSTEM_PORT}`);
    });
}

function killExistingServers() {
    const ports = [80, 443, 8080]; // Ports HTTP/HTTPS typiques
    logToFile('Tentative de suppression des serveurs existants sur les ports : ' + ports.join(', '));
    try {
        ports.forEach(port => {
            logToFile(`Recherche des processus sur le port ${port}...`);
            const netstatCmd = `netstat -aon | findstr :${port}`;
            let result;
            try {
                result = execSync(netstatCmd, { stdio: 'pipe' }).toString();
            } catch (e) {
                logToFile(`Aucun processus trouvé sur le port ${port} ou erreur : ${e.message}`);
                return;
            }
            const lines = result.trim().split('\n');
            if (lines.length === 0 || lines[0] === '') {
                logToFile(`Aucun processus actif détecté sur le port ${port}`);
                return;
            }
            lines.forEach(line => {
                const parts = line.trim().split(/s+/);
                if (parts.length >= 5) {
                    const pid = parts[4];
                    try {
                        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
                        logToFile(`Processus (PID: ${pid}) sur le port ${port} terminé avec succès.`);
                    } catch (e) {
                        logToFile(`Échec de la terminaison du PID ${pid} sur le port ${port} : ${e.message}`);
                    }
                }
            });
        });
    } catch (e) {
        logToFile('Erreur générale lors de la suppression des serveurs : ' + e.message);
    }
}

function isAdmin() {
    try {
        execSync('net session', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

function elevatePrivileges() {
    if (!isAdmin()) {
        logToFile('Privilèges administratifs requis, tentative d’élévation...');
        const elevateScript = path.join(os.tmpdir(), 'elevate.bat');
        const scriptContent = `@echo off
powershell -Command "Start-Process node -ArgumentList '${path.join(PROJECT_DIR, 'LaunchProject.js')}' -Verb RunAs"
exit`;
        fs.writeFileSync(elevateScript, scriptContent);
        spawn(elevateScript, { detached: true, shell: true, stdio: 'ignore' }).unref();
        logToFile('Relance en mode administrateur initiée. Ce processus va s’arrêter.');
        process.exit(0);
    } else {
        logToFile('Exécution en mode administrateur confirmée.');
    }
}

function launchProject() {
    killExistingServers();
    elevatePrivileges();
    let startHttpServer;
    try {
        startHttpServer = require(path.join(TOOLS_DIR, 'StartHttpServer.js'));
    } catch (error) {
        logToFile(`Erreur lors du chargement de StartHttpServer.js : ${error.message}`);
        throw error;
    }

    try {
        startHttpServer.startHttpServer();
        logToFile('Lancement de StartHttpServer.js réussi');
    } catch (error) {
        logToFile(`Erreur lors du démarrage du serveur HTTPS : ${error.message}`);
        throw error;
    }
}

// Handle uncaught exceptions to prevent crashes
process.on('uncaughtException', (err) => {
    logToFile(`Erreur non capturée : ${err.message}`);
    console.error(err.stack);
});

module.exports = { launchProject };
if (require.main === module) {
    logToFile('Démarrage de LaunchProject.js...');
    launchProject();
}
