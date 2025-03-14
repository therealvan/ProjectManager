
        const { execSync } = require('child_process');
        const fs = require('fs');
        const logStream = fs.createWriteStream('project.log', { flags: 'a' });
        const originalConsoleLog = console.log;
        console.log = (...args) => {
            logStream.write(args.join(' ') + '
');
            originalConsoleLog(...args);
        };
        console.log('Push vers GitHub après redémarrage...');
        const branch = fs.readFileSync('Branche.git', 'utf8').trim();
        execSync(`git push origin ${branch}`, { stdio: 'inherit' });
        console.log('UpdateProject.js terminé après redémarrage.');
        logStream.end();
    