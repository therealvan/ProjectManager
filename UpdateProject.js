// UpdateProject.js
// Verifies imports and removes unused src/ExternalLib/Three directory
const fs = require('fs');
const path = require('path');

// Define project directory and paths
const PROJECT_DIR = __dirname;
const EXTERNAL_LIB_DIR = path.join(PROJECT_DIR, 'src', 'ExternalLib');
const THREE_DIR = path.join(EXTERNAL_LIB_DIR, 'Three');
const INDEX_PATH = path.join(PROJECT_DIR, 'index.html');
const TESTCUBE_PATH = path.join(PROJECT_DIR, 'src', 'Game', 'TestCube.html');
const TESTCUBE_WEBGPU_PATH = path.join(PROJECT_DIR, 'src', 'Game', 'TestCubeWebGPU.html');

// Log to project.log
const logStream = fs.createWriteStream(path.join(PROJECT_DIR, 'project.log'), { flags: 'a' });
console.log = (...args) => logStream.write(args.join(' ') + '\n');

// Function to update imports if needed
function updateImports(filePath, oldImport, newImport) {
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(oldImport)) {
            content = content.replace(oldImport, newImport);
            fs.writeFileSync(filePath, content);
            console.log(`Updated import in ${path.basename(filePath)} to ${newImport}`);
        } else {
            console.log(`No update needed for ${path.basename(filePath)}`);
        }
    }
}

// Check and update imports (just to be sure)
const correctImport = "import * as THREE from '/src/ExternalLib/three.js/build/three.module.js'";
updateImports(INDEX_PATH, "import * as THREE from './src/ExternalLib/three.js/build/three.module.js'", correctImport); // index.html uses relative path
updateImports(TESTCUBE_PATH, "import * as THREE from '/src/ExternalLib/Three/three.Modules.js'", correctImport);
updateImports(TESTCUBE_WEBGPU_PATH, "import * as THREE from '/src/ExternalLib/Three/three.Modules.js'", correctImport);

// Remove src/ExternalLib/Three directory if it exists
if (fs.existsSync(THREE_DIR)) {
    fs.rmSync(THREE_DIR, { recursive: true, force: true });
    console.log('Deleted src/ExternalLib/Three directory');
} else {
    console.log('src/ExternalLib/Three directory not found, no deletion needed');
}

// Push changes to GitHub
const { pushChanges } = require('./src/GitHub/GitHub.js');
console.log('Pushing code to GitHub...');
pushChanges();
console.log('Push operation initiated.');