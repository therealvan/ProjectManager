const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const github = require('./src/GitHub/GitHub.js');
const debug = require('./src/GitHub/DiagGitHub.js');

console.log('Lancement de UpdateProject.js...');

function updateProject() {
    try {
        // Dossier source et destination
        const srcDir = path.join(__dirname, 'src');
        const oldWebglDir = path.join(__dirname, 'webgl');
        const newWebglDir = path.join(srcDir, 'webgl');

        // Vérifie si src/ existe, sinon le crée
        if (!fs.existsSync(srcDir)) {
            fs.mkdirSync(srcDir, { recursive: true });
        }

        // Déplace webgl/ sous src/
        if (fs.existsSync(oldWebglDir)) {
            fs.renameSync(oldWebglDir, newWebglDir);
            console.log('Dossier webgl/ déplacé sous src/.');
        } else if (!fs.existsSync(newWebglDir)) {
            // Si webgl/ n'existe pas à la racine, crée-le sous src/
            fs.mkdirSync(newWebglDir, { recursive: true });

            // Recrée index.html
            const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Cube WebGL</title>
    <style>
        body { margin: 0; overflow: hidden; }
        canvas { width: 100vw; height: 100vh; display: block; }
    </style>
</head>
<body>
    <canvas id="webgl-canvas"></canvas>
    <script src="cube.js"></script>
</body>
</html>
            `;
            fs.writeFileSync(path.join(newWebglDir, 'index.html'), htmlContent.trim());

            // Recrée cube.js
            const cubeContent = `
const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    alert('WebGL non supporté');
}

// Vertex Shader
const vsSource = \`
    attribute vec4 aPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
    }
\`;

// Fragment Shader
const fsSource = \`
    void main() {
        gl_FragColor = vec4(0.0, 0.5, 1.0, 1.0); // Couleur bleue
    }
\`;

// Création des shaders
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

// Données du cube
const vertices = new Float32Array([
    -1, -1,  1,   1, -1,  1,   1,  1,  1,  -1,  1,  1,
    -1, -1, -1,  -1,  1, -1,   1,  1, -1,   1, -1, -1,
    -1, -1, -1,  -1, -1,  1,  -1,  1,  1,  -1,  1, -1,
     1, -1, -1,   1,  1, -1,   1,  1,  1,   1, -1,  1,
    -1,  1, -1,  -1,  1,  1,   1,  1,  1,   1,  1, -1,
    -1, -1, -1,   1, -1, -1,   1, -1,  1,  -1, -1,  1
]);
const indices = new Uint16Array([
    0, 1, 2,  0, 2, 3,     // avant
    4, 5, 6,  4, 6, 7,     // arrière
    8, 9, 10, 8, 10, 11,   // gauche
    12, 13, 14, 12, 14, 15, // droite
    16, 17, 18, 16, 18, 19, // dessus
    20, 21, 22, 20, 22, 23  // dessous
]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// Attributs et uniforms
const aPosition = gl.getAttribLocation(program, 'aPosition');
gl.enableVertexAttribArray(aPosition);
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

const uModelViewMatrix = gl.getUniformLocation(program, 'uModelViewMatrix');
const uProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');

// Matrices
function createMatrix() {
    const matrix = new Float32Array(16);
    for (let i = 0; i < 16; i++) matrix[i] = i % 5 === 0 ? 1 : 0;
    return matrix;
}

const modelViewMatrix = createMatrix();
const projectionMatrix = createMatrix();

// Perspective
const fieldOfView = 45 * Math.PI / 180;
const aspect = canvas.width / canvas.height;
const zNear = 0.1;
const zFar = 100.0;
const proj = projectionMatrix;
proj[0] = 1 / (aspect * Math.tan(fieldOfView / 2));
proj[5] = 1 / Math.tan(fieldOfView / 2);
proj[10] = -(zFar + zNear) / (zFar - zNear);
proj[11] = -1;
proj[14] = -(2 * zFar * zNear) / (zFar - zNear);

// Position initiale
modelViewMatrix[14] = -6;

// Animation
let rotation = 0;
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    rotation += 0.02;

    const rotMatrix = createMatrix();
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    rotMatrix[0] = cos;
    rotMatrix[2] = -sin;
    rotMatrix[5] = 1;
    rotMatrix[8] = sin;
    rotMatrix[10] = cos;

    const finalMatrix = createMatrix();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            finalMatrix[i * 4 + j] = 0;
            for (let k = 0; k < 4; k++) {
                finalMatrix[i * 4 + j] += modelViewMatrix[i * 4 + k] * rotMatrix[k * 4 + j];
            }
        }
    }

    gl.uniformMatrix4fv(uModelViewMatrix, false, finalMatrix);
    gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
}

gl.enable(gl.DEPTH_TEST);
gl.clearColor(0.1, 0.1, 0.1, 1.0);
render();
            `;
            fs.writeFileSync(path.join(newWebglDir, 'cube.js'), cubeContent.trim());
            console.log('Dossier webgl/ créé sous src/ avec les fichiers nécessaires.');
        }

        // Git operations
        console.log('Ajout des fichiers locaux...');
        execSync('git add .', { stdio: 'inherit' });

        console.log('Création du commit...');
        execSync('git commit -m "Déplacement de webgl/ sous src/" --allow-empty', { stdio: 'inherit' });

        console.log('Pousse des modifications vers le dépôt distant...');
        execSync('git push origin main', { stdio: 'inherit' });

        console.log('Liste des fichiers locaux après push...');
        github.listLocalFiles();

        console.log('UpdateProject.js terminé.');
    } catch (error) {
        debug.log('Erreur lors de la mise à jour : ' + error.message);
    }
}

updateProject();