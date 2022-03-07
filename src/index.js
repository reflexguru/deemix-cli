import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import dz from 'deezer-js';

import setup from './setup.js';

const { Deezer } = dz;
const deezer = new Deezer();

const args = process.argv.slice(2);

let access = true;
try { fs.accessSync(path.resolve() + '/config.json') } catch { access = false };

let config;

if (!access || args[0] === 'setup') {
  if (args[0] !== 'setup') {
    console.log(
      'Since you run this for the first time, we need to set up some things...\n' +
      `You can run this setup anytime later by running ${ chalk.magenta(`deemix setup`) }!\n`
    );
  }
  await setup();
} else {
  config = JSON.parse(fs.readFileSync(path.resolve() + '/config.json'));
}

if (args[0] === 'setup') {
  process.exit();
}

console.log(`${ chalk.green('i') } Logging in...`);
await deezer.login_via_arl(config.arl);

for (const cmd of fs.readdirSync(path.resolve() + '/src/commands')) {
  const module = (await import(path.resolve() + '/src/commands/' + cmd)).default;
  if (module.aliases.includes(args[0])) {
    module.exec(args, deezer, config);
    break;
  }
}
