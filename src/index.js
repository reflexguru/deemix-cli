#!/usr/bin/env node

import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import dz from 'deezer-js';

import setup from './setup.js';

import { fileURLToPath } from 'url';

const dirName = fileURLToPath(import.meta.url).split('/src/index.js')[0];

const { Deezer } = dz;
const deezer = new Deezer();

const args = process.argv.slice(2);

let access = true;
try { fs.accessSync(dirName + '/config.json') } catch { access = false };

let config;

if (!access || args[0] === 'setup') {
  if (args[0] !== 'setup') {
    console.log(
      'Since you run this for the first time, we need to set up some things...\n' +
      `You can run this setup anytime later by running ${ chalk.magenta(`deemix setup`) }!\n`
    );
  }
  await setup(dirName);
} else {
  config = JSON.parse(fs.readFileSync(dirName + '/config.json'));
}

if (args[0] === 'setup') {
  process.exit();
}

console.log(`${ chalk.green('i') } Logging in...`);
await deezer.login_via_arl(config.arl);

let ran = false

for (const cmd of fs.readdirSync(dirName + '/src/commands')) {
  const module = (await import(dirName + '/src/commands/' + cmd)).default;
  if (module.aliases.includes(args[0])) {
    module.exec(args, deezer, config, dirName);
    ran = true;
    break;
  }
}

if (!ran) {
  console.log(
    '\nNo valid command has been specified.\n' +
    `Check available commands with ${ chalk.magenta(`deemix help`) }!`
  );
}
