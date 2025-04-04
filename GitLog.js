const chalk = require('chalk');
const ProgressBar = require('progress');
const { PROJECT_DIR } = require('./GitHub.js');

function logMessage(message, type = 'info') {
    switch (type) {
        case 'info':
            console.log(chalk.blueBright(message));
            break;
        case 'success':
            console.log(chalk.greenBright(message));
            break;
        case 'error':
            console.log(chalk.redBright(message));
            break;
        case 'warning':
            console.log(chalk.yellowBright(message));
            break;
        default:
            console.log(message);
    }
}

function logProgress(task, totalSteps) {
    const bar = new ProgressBar(`${chalk.cyan(task)} [:bar] :current/:total`, {
        total: totalSteps,
        width: 30,
        complete: chalk.greenBright('█'),
        incomplete: '░',
        clear: true
    });
    return bar;
}

module.exports = { logMessage, logProgress };