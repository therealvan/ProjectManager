// UpdateProject.js
const fs = require('fs');
const path = require('path');
const { createBranch, pushChanges } = require('./src/GitHub/GitHub.js');

// Redirect console output to project.log
const logStream = fs.createWriteStream(path.join(__dirname, 'project.log'), { flags: 'a' });
console.log = (...args) => logStream.write(args.join(' ') + '\n');

// Push code to a new branch 'test'
createBranch('test'); // Create the new branch 'test' from the current branch
pushChanges();        // Push all changes to the 'test' branch

// Project tree structure for this update
/*
├── src/
│   └── GitHub/
│       └── GitHub.js  # Used for branch creation and push
├── UpdateProject.js   # This file
└── project.log        # Log file for tracing actions
*/