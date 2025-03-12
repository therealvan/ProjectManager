// Server.js - Serveur HTTP pour le jeu
const http = require('http');
const fs = require('fs');
const path = require('path');

function startServer() {
    const server = http.createServer((req, res) => {
        if (req.url === '/' || req.url === '/index.html') {
            const filePath = path.join(__dirname, 'index.html');
            fs.readFile(filePath, (err, content) => {
                if (err) {
                    res.writeHead(500);
                    res.end('Erreur serveur');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content);
                }
            });
        } else if (req.url === '/favicon.ico') {
            res.writeHead(204); // No Content
            res.end();
        } else {
            res.writeHead(404);
            res.end('Page non trouvée');
        }
    });
    
    server.listen(8080, () => {
        console.log('Serveur démarré sur http://localhost:8080');
    });
}

module.exports = { startServer };
