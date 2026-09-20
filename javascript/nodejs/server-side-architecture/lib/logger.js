const chalk = require('chalk');

function logRequest(method, url, statusCode) {
    const status = statusCode >= 400 ? chalk.red(statusCode) : chalk.green(statusCode);
    console.log(`${chalk.cyan(method)} ${url} -> ${status}`);
}

function logError(error) {
    console.error(chalk.red(`Error: ${error.message}`));
}

module.exports = { logRequest, logError };