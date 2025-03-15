// UpdateProject.js
const fs = require('fs');
const path = require('path');
const { pushChanges } = require('./src/GitHub/GitHub.js');

function updateProject() {
    // Setup logging to project.log
    const projectLog = path.join(__dirname, 'project.log');
    const logStream = fs.createWriteStream(projectLog, { flags: 'a' });
    const originalConsoleLog = console.log;
    console.log = (...args) => {
        logStream.write(args.join(' ') + '\n');
        originalConsoleLog(...args);
    };

    // Perform the push (includes Readme.js update with Tree.grok)
    pushChanges();

    // Restore console and close log stream
    console.log = originalConsoleLog;
    logStream.end();
}

// Run the update
updateProject();

module.exports = { updateProject };