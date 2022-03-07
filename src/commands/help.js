import chalk from 'chalk';

export default {
  aliases: ['h', 'help'],
  exec: () => {
    console.log(
      '\nAvailable commands:\n' +
      ` - ${ chalk.magenta(`deemix help`) } - provides this list\n` +
      ` - ${ chalk.magenta(`deemix setup`) } - runs the first-time script setup\n` +
      ` - ${ chalk.magenta(`deemix download <url>`) } - downloads from the provided link\n`
    );
  }
}
