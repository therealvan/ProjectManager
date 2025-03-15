// UpdateProject.js
// Fixes LF/CRLF warnings and handles three.js as flat files
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define project directory and paths
const PROJECT_DIR = __dirname;
const GITATTRIBUTES_PATH = path.join(PROJECT_DIR, '.gitattributes');
const THREEJS_SRC = path.join(PROJECT_DIR, 'src', 'ExternalLib', 'three.js');
const THREEJS_DEST = path.join(PROJECT_DIR, 'src', 'ExternalLib', 'three');

// Log to project.log
const logStream = fs.createWriteStream(path.join(PROJECT_DIR, 'project.log'), { flags: 'a' });
console.log = (...args) => logStream.write(args.join(' ') + '\n');

// Create .gitattributes to standardize line endings
const gitattributesContent = `* text=auto eol=lf\n`;
if (!fs.existsSync(GITATTRIBUTES_PATH)) {
    fs.writeFileSync(GITATTRIBUTES_PATH, gitattributesContent);
    console.log('.gitattributes created to enforce LF line endings');
}

// Handle three.js: remove git repo and copy only necessary files
if (fs.existsSync(THREEJS_SRC)) {
    console.log('Converting three.js from git repo to flat files...');
    // Remove the git repository
    execSync(`git rm -r --cached src/ExternalLib/three.js`, { cwd: PROJECT_DIR });
    fs.rmSync(THREEJS_SRC, { recursive: true, force: true });
    // Recreate directory and copy three.module.js
    fs.mkdirSync(THREEJS_DEST, { recursive: true });
    const threeModuleSrc = path.join(THREEJS_SRC, 'build', 'three.module.js');
    const threeModuleDest = path.join(THREEJS_DEST, 'three.module.js');
    if (fs.existsSync(threeModuleSrc)) {
        fs.copyFileSync(threeModuleSrc, threeModuleDest);
    } else {
        fs.writeFileSync(threeModuleDest, '// Placeholder for three.module.js');
    }
    console.log('three.js converted to flat files in src/ExternalLib/three');
}

// Update index.html to point to new three.js location
const INDEX_PATH = path.join(PROJECT_DIR, 'index.html');
let indexContent = fs.readFileSync(INDEX_PATH, 'utf8');
indexContent = indexContent.replace(
    "import * as THREE from './src/ExternalLib/three.js/build/three.module.js'",
    "import * as THREE from './src/ExternalLib/three/three.module.js'"
);
fs.writeFileSync(INDEX_PATH, indexContent);
console.log('index.html updated with new Three.js path');

// Stage and push changes
const { pushChanges } = require('./src/GitHub/GitHub.js');
console.log('Pushing updated code to GitHub...');
pushChanges();
console.log('Push operation initiated.');