// Debug.js - Execute Functions.js, ProjectTree.js, and Code.js for debugging
const fs = require('fs');
const path = require('path');

// Create log stream
const logStream = fs.createWriteStream(path.join(__dirname, 'project.log'), { flags: 'a' });
const originalConsoleLog = console.log;
console.log = (...args) => logStream.write(args.join(' ') + '\n');

// Import required modules
const { listFunctionsInJsFiles } = require('./Functions.js');
const { generateTree } = require('./ProjectTree.js');
const { writeCodeGrok } = require('./Code.js');

// Function to execute debug steps and close stream
function runDebug() {
    try {
        console.log('Executing Functions.js...');
        listFunctionsInJsFiles();

        console.log('Executing ProjectTree.js...');
        generateTree();

        console.log('Executing Code.js...');
        writeCodeGrok();

        console.log('Debug.js execution completed.');
    } catch (error) {
        console.log('Error during debug execution:', error.message);
    } finally {
        logStream.end(() => originalConsoleLog('Log stream closed.'));
    }
}

// Export debug function
module.exports = { debug: runDebug };

// Run directly if called
if (require.main === module) {
    runDebug();
}
