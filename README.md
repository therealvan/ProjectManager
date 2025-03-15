![Generated Image](./generated_image.jpg)

# ProjectManager

## Description
ProjectManager is an automated project management tool using Node.js
It allows initializing, updating, and managing a GitHub by only speaking to Grok

## Prerequisites
- Node.js installed
- Git installed and configured
- Access to the GitHub repository: [https://github.com/therealvan/ProjectManager](https://github.com/therealvan/ProjectManager)

## Project Structure
```
├── src/
│   └── GitHub/
│       ├── DiagGitHub.js  # Error logs
│       └── GitHub.js      # Git functions
├── ProjectTree.js        # Generates the tree
├── Code.js                # Consolidates JS code
├── Fonctions.js           # Lists functions
├── Readme.js              # Updates this README
├── StartProject.js        # Initializes the project
├── UpdateProject.js       # Updates the project
├── README.md              # This file
├── Branche.git            # Active branch
└── *.grok                 # Generated files
```

## Features
- Cloning the repository from GitHub
- Cleaning and managing local files
- Creating and deleting remote branches
- Forced push prioritizing local changes
- Generating tree and function lists
- Automatic README update on each push

## Contribution
1. Fork the project
2. Create a branch for your changes
3. Submit a pull request

## Last Update
3/15/2025, 2:04:46 PM

## License
No license specified at this time.
