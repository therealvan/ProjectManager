// GetSystemInfo.js - Retrieve system information using Node.js os module
const os = require('os');

function getSystemInfo() {
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(1); // Total RAM in MB
    const freeRam = (os.freemem() / 1024 / 1024).toFixed(1); // Free RAM in MB
    const usedRam = (totalRam - freeRam).toFixed(1); // Used RAM in MB

    return {
        ram: {
            used: usedRam,
            total: totalRam
        },
        // Add more system info here in the future (e.g., CPU, disk, etc.)
        cpuCores: os.cpus().length,
        platform: os.platform(),
        hostname: os.hostname()
    };
}

// Simple server to expose system info via API
const http = require('http');
const server = http.createServer((req, res) => {
    if (req.url === '/system-info' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        res.end(JSON.stringify(getSystemInfo()));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`System info server running on port ${PORT}`);
});

module.exports = { getSystemInfo };
