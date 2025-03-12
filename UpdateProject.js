const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { spawn } = require('child_process');
const os = require('os');

const PROJECT_DIR = path.join(__dirname);
const SRC_WEBGL_DIR = path.join(PROJECT_DIR, 'src', 'webGL');
const LOG_FILE = path.join(PROJECT_DIR, 'project_log.txt');
const TEMP_DIR = path.join(os.tmpdir(), 'project_manager_browser');

// Fonction pour écrire dans project_log.txt
function logToFile(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
}

// Redirige les sorties console vers le fichier log
const originalConsoleLog = console.log;
console.log = function (message) {
    logToFile(message);
    originalConsoleLog.apply(console, arguments);
};

console.error = function (message) {
    logToFile(`ERROR: ${message}`);
    originalConsoleLog.apply(console, arguments);
};

// Vérifie la syntaxe JS
function checkSyntax(code, fileName) {
    try {
        new Function(code);
        console.log(`Syntaxe de ${fileName} valide.`);
    } catch (error) {
        console.error(`Erreur de syntaxe dans ${fileName} : ${error.message}`);
        throw error;
    }
}

// Détecte le navigateur par défaut sous Windows
function getDefaultBrowser() {
    const browserReg = execSync('reg query HKEY_CLASSES_ROOT\\http\\shell\\open\\command /ve', { encoding: 'utf8' });
    const match = browserReg.match(/"([^"]*exe)"/i);
    return match ? match[1] : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
}

// Vérifie si le serveur est actif
function isServerAlive(port) {
    try {
        execSync(`netstat -an | findstr :${port}`, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

// Structure modulaire du projet
const projectStructure = {
    'src': {
        'webGL': {
            'WebGLGame.js': `// WebGLGame.js - Gestion du jeu 3D
const fs = require('fs');
const path = require('path');

function initWebGL() {
    console.log('Initialisation de WebGL...');
    const htmlContent = \`
<!DOCTYPE html>
<html>
<head>
    <title>WebGL Game</title>
</head>
<body>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    <script>
        window.onload = function() {
            const canvas = document.getElementById('gameCanvas');
            const gl = canvas.getContext('webgl');
            if (!gl) {
                console.error('WebGL non supporté');
                return;
            }
            
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            
            const vsSource = "attribute vec4 aPosition; void main() { gl_Position = aPosition; }";
            const fsSource = "void main() { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }";
            
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertexShader, vsSource);
            gl.compileShader(vertexShader);
            
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragmentShader, fsSource);
            gl.compileShader(fragmentShader);
            
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            gl.useProgram(program);
            
            const positions = new Float32Array([
                0.0,  0.5,  0.0,
               -0.5, -0.5,  0.0,
                0.5, -0.5,  0.0
            ]);
            
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
            
            const aPosition = gl.getAttribLocation(program, 'aPosition');
            gl.enableVertexAttribArray(aPosition);
            gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
            
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };
    </script>
</body>
</html>
    \`;
    fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent);
    console.log('WebGL initialisé avec un triangle rouge.');
}

module.exports = { initWebGL };
`
        }
    }
};

// Fonction principale pour mettre à jour le projet
function updateProject() {
    console.log('Démarrage de UpdateProject.js...');

    // Crée le fichier project_log.txt s'il n'existe pas
    if (!fs.existsSync(LOG_FILE)) {
        fs.writeFileSync(LOG_FILE, 'Project log initialized\n');
        console.log('Fichier project_log.txt créé.');
    }

    // Vérifie si lockdown-install.js existe et le supprime s'il est présent
    const lockdownFile = path.join(PROJECT_DIR, 'lockdown-install.js');
    if (fs.existsSync(lockdownFile)) {
        fs.unlinkSync(lockdownFile);
        console.log('lockdown-install.js détecté et supprimé pour éviter les interférences.');
    }

    // Crée la structure WebGL
    if (!fs.existsSync(SRC_WEBGL_DIR)) {
        fs.mkdirSync(SRC_WEBGL_DIR, { recursive: true });
        console.log('Dossier src/webGL créé.');
    }

    // Écrit les nouveaux fichiers
    for (const [file, content] of Object.entries(projectStructure.src.webGL)) {
        const filePath = path.join(SRC_WEBGL_DIR, file);
        checkSyntax(content, file);
        fs.writeFileSync(filePath, content);
        console.log(`${file} créé dans src/webGL.`);
    }

    // Utilise GitHub.js pour gérer le dépôt
    const github = require(path.join(PROJECT_DIR, 'src', 'GitHub', 'GitHub.js'));
    github.cloneOrUpdateRepo('https://github.com/therealvan/ProjectManager.git', 'main');
    execSync('git add .', { cwd: PROJECT_DIR });
    execSync('git commit -m "Utilisation de http-server pour WebGL" --allow-empty', { cwd: PROJECT_DIR });
    execSync('git push origin main', { cwd: PROJECT_DIR });
    console.log('Modifications poussées vers GitHub.');

    // Lance le jeu WebGL
    const webgl = require(path.join(SRC_WEBGL_DIR, 'WebGLGame.js'));
    webgl.initWebGL();

    // Utilise http-server global au lieu de Server.js
    try {
        execSync('http-server -p 8080 -c-1', { cwd: PROJECT_DIR, stdio: 'inherit' });
    } catch (error) {
        console.error('http-server n’est pas disponible ou a échoué. Installation locale...');
        execSync('npm install http-server --save-dev', { cwd: PROJECT_DIR });
        spawn('npx', ['http-server', '-p', '8080', '-c-1'], { cwd: PROJECT_DIR, detached: true, stdio: 'ignore' }).unref();
    }

    // Attend que le serveur soit prêt
    let retries = 10;
    while (retries > 0 && !isServerAlive(8080)) {
        require('deasync').sleep(1000);
        retries--;
    }
    if (retries === 0) {
        console.error('Le serveur n’a pas démarré.');
        return;
    }

    // Lance le navigateur par défaut
    const browserPath = getDefaultBrowser();
    if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR, { recursive: true });
    }
    const browserProcess = spawn(browserPath, [
        '--enable-webgpu',
        '--user-data-dir=' + TEMP_DIR,
        'http://localhost:8080'
    ], { detached: true, stdio: 'ignore' });
    browserProcess.unref();
    console.log('Navigateur lancé avec WebGL.');

    // Nettoyage après fermeture
    process.on('exit', () => {
        if (fs.existsSync(TEMP_DIR)) {
            fs.rmSync(TEMP_DIR, { recursive: true, force: true });
            console.log('Dossier temporaire supprimé.');
        }
    });

    console.log('Mise à jour du projet terminée.');
}

// Exécute la fonction principale
try {
    updateProject();
} catch (error) {
    console.error(`Erreur lors de l'exécution de UpdateProject.js : ${error.message}`);
}

module.exports = { updateProject };