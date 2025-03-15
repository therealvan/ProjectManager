// UpdateProject.js - Push local changes to GitHub repository
const fs = require('fs');
const path = require('path');

// Redirect console output to project.log
const logStream = fs.createWriteStream(path.join(__dirname, 'project.log'), { flags: 'a' });
console.log = (...args) => logStream.write(args.join(' ') + '\n');

// Import GitHub functions
const { pushChanges } = require('./src/GitHub/GitHub.js');

// Push local changes to the repository
pushChanges();

logStream.end();