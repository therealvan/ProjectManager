// UpdateProject.js
const fs = require('fs');
const path = require('path');
const { pushChanges, deleteBranch } = require('./src/GitHub/GitHub.js');

// Redirect console output to project.log
const logStream = fs.createWriteStream(path.join(__dirname, 'project.log'), { flags: 'a' });
console.log = (...args) => logStream.write(args.join(' ') + '\n');

// Push local changes to the current branch
pushChanges();

// Delete the remote branches 'test' and 'test2'
deleteBranch('test');
deleteBranch('test2');

// Project tree structure for this update
/*
├── src/
│   └── GitHub/
│       └── GitHub.js  # Used for push and branch deletion
├── UpdateProject.js   # This file
└── project.log        # Log file for tracing actions
*/