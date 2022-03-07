import chalk from 'chalk';
import deemix from 'deemix';

export default {
  aliases: ['d', 'download'],
  exec: async (args, dz, configOverwrite) => {
    console.log(`${ chalk.green('i') } Getting info about the song...`);
    const info = await deemix.generateDownloadObject(dz, args[1], configOverwrite.maxBitrate);
    console.log(`${ chalk.green('𝅘𝅥𝅮') } ${ info.artist } - ${ info.title }`);
    console.log(`${ chalk.green('i') } Downloading the song...`);
    const listener = { send: receiveEvent }
    const downloader = new deemix.downloader.Downloader(dz, info, { ...deemix.settings.DEFAULTS, ...configOverwrite }, listener);
    await downloader.start();
    if (info.failed) {
      console.log(`${ chalk.red('i') } Failed to download the song.`);
    }
  }
}

function receiveEvent(event, info) {
  switch (event) {
    case 'downloadInfo':
      if (info.state === 'gotTags') {
        console.log(`${ chalk.green('i') } Got song tags.`);
      }

      if (info.state === 'gotBitrate') {
        console.log(`${ chalk.green('i') } Got song bitrate.`);
      }

      if (info.state === 'gotAlbumArt') {
        console.log(`${ chalk.green('i') } Got album art.`);
      }
    break

    case 'updateQueue':
      if (info.error) {
        console.log(`${ chalk.red('i') } ${ info.error }`);
      } else if (info.downloaded) {
        console.log(
          `${ chalk.green('i') } Track has been successfully downloaded.\n` +
          `${ chalk.green('i') } ${ chalk.magenta(info.downloadPath) }`
        );
      }
    break
  }
}
