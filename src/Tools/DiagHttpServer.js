const fs = require('fs');
const path = require('path');

const PROJECT_DIR = path.join(__dirname, '..', '..');
const HTTP_LOG_FILE = path.join(PROJECT_DIR, 'httpserver.log');

function log(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(HTTP_LOG_FILE, `[${timestamp}] ${message}\n`, 'utf8');
    console.log(message);
}

if (!fs.existsSync(HTTP_LOG_FILE)) {
    fs.writeFileSync(HTTP_LOG_FILE, '');
    console.log('Fichier httpserver.log créé.');
}

module.exports = { log };
