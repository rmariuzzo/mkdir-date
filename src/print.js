const chalk = require('chalk')

module.exports.debug = (...args) => {
  console.debug(chalk.gray.bold('> '), ...(args.map(arg => chalk.gray(arg))))
}

module.exports.error = (...args) => {
  console.error(chalk.red.bold('⨉ '), ...(args.map(arg => chalk.red(arg))))
}

module.exports.warn = (...args) => {
  console.warn(chalk.yellow.bold('! '), ...(args.map(arg => chalk.yellow(arg))))
}

module.exports.success = (...args) => {
  console.warn(chalk.green.bold('✓ '), ...(args.map(arg => chalk.green(arg))))
}

module.exports.log = (...args) => {
  console.warn(chalk.white.bold('• '), ...(args.map(arg => chalk.white(arg))))
}
