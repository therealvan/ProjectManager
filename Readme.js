const fs = require('fs');
const path = require('path');

function updateReadme() {
    console.log('Updating README.md...');
    
    // Read the project structure from Tree.grok
    const treeGrokPath = path.join(__dirname, 'Tree.grok');
    let projectStructure = '';
    if (fs.existsSync(treeGrokPath)) {
        projectStructure = fs.readFileSync(treeGrokPath, 'utf8').trim();
    } else {
        projectStructure = 'Tree.grok not found. Run ProjectTree.js to generate it.';
    }

    const readmeContent = `![Generated Image](./generated_image.jpg)

# ProjectManager

## Description
ProjectManager is an automated project management tool using Node.js
It allows initializing, updating, and managing a GitHub by only speaking to Grok

## Prerequisites
- Node.js installed
- Git installed and configured
- Access to the GitHub repository: [https://github.com/therealvan/ProjectManager](https://github.com/therealvan/ProjectManager)

## Project Structure
\`\`\`
${projectStructure}
\`\`\`

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
${new Date().toLocaleString('en-US')}

## License
No license specified at this time.
`;

    fs.writeFileSync(path.join(__dirname, 'README.md'), readmeContent, 'utf8');
    console.log('README.md updated successfully.');
}

module.exports = { updateReadme };

if (require.main === module) {
    updateReadme();
}
