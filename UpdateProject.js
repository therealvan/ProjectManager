// UpdateProject.js
// Pushes the project code to GitHub using GitHub.js
const fs = require('fs');
const path = require('path');
const { pushChanges } = require('./src/GitHub/GitHub.js');

// Define project directory
const PROJECT_DIR = __dirname;

// Log to project.log
const logStream = fs.createWriteStream(path.join(PROJECT_DIR, 'project.log'), { flags: 'a' });
console.log = (...args) => logStream.write(args.join(' ') + '\n');

// Perform the push
console.log('Pushing code to GitHub...');
pushChanges();
console.log('Push operation initiated.');