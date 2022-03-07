import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { TrackFormats } from 'deezer-js';

export default async function setup() {
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
    }
  ]);

  const config = {
    downloadLocation: prompt.store,
    arl: prompt.arl,
    maxBitrate: TrackFormats[prompt.quality]
  };

  fs.writeFileSync(path.resolve() + '/config.json', JSON.stringify(config), 'utf8');
  console.log(`\n${ chalk.green('i') } Config has been saved in ${ chalk.magenta(path.resolve() + '/config.json') }\n`);
  console.log(`\n${ chalk.green('i') } If you want to configure this script more precisely, you can extend the freshly created config.json according to the documentation of the ${ chalk.green('deemix') } library.\n`);
}
