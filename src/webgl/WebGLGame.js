// WebGLGame.js - Gestion du jeu 3D
const fs = require('fs');
const path = require('path');

function initWebGL() {
    console.log('Initialisation de WebGL...');
    const canvas = '<canvas id="gameCanvas" width="800" height="600"></canvas>';
    fs.writeFileSync(path.join(__dirname, 'index.html'), canvas);
    
    const glScript = `
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
    `;

    fs.appendFileSync(path.join(__dirname, 'index.html'), '<script>' + glScript + '</script>');
    console.log('WebGL initialisé avec un triangle rouge.');
}

module.exports = { initWebGL };
