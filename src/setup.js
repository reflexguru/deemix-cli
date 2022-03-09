import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import { TrackFormats } from 'deezer-js';

export default async function setup(dirName) {
  const prompt = await inquirer.prompt([
    {
      type: 'input',
      name: 'store',
      message: `Where do you want your downloads to be stored? (enter a full path)\n>`
    },
    {
      type: 'input',
      name: 'arl',
      message: `Input your ${ chalk.magenta('ARL') } cookie to access features\n>`
    },
    {
      type: 'list',
      name: 'quality',
      message: `Select your preferred quality`,
      choices: [
        'FLAC',
        'MP3_320',
        'MP3_128'
      ]
    },
    {
      type: 'input',
      name: 'proxy',
      message: `Would you like to use a proxy? (y/${ chalk.magenta('n') })\n>`
    }
  ]);

  let proxyPrompt;

  if (prompt.proxy.toLowerCase() === 'y') {
    proxyPrompt = await inquirer.prompt([
      {
        type: 'input',
        name: 'host',
        message: `Enter the proxy host\n>`
      },
      {
        type: 'input',
        name: 'port',
        message: `Enter the proxy port\n>`
      },
      {
        type: 'input',
        name: 'pass',
        message: `Enter the proxy password (if needed)\n>`
      }
    ]);
  }

  const config = {
    downloadLocation: prompt.store,
    arl: prompt.arl,
    maxBitrate: TrackFormats[prompt.quality],
    ...(proxyPrompt ? { proxy: proxyPrompt } : {})
  };

  fs.writeFileSync(dirName + '/config.json', JSON.stringify(config), 'utf8');
  console.log(`\n${ chalk.green('i') } Config has been saved in ${ chalk.magenta(dirName + '/config.json') }`);
  console.log(`${ chalk.green('i') } If you want to configure this script more precisely, you can extend the freshly created config.json according to the documentation of the ${ chalk.green('deemix') } library.\n`);
}
