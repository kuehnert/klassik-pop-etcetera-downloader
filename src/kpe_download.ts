import axios from 'axios';
import { parse } from 'node-html-parser';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const rootPath = './out/';
const url = 'https://www.deutschlandfunk.de/klassik-pop-et-cetera-100.html';

const downloadImage = async (url: string, filename: string) => {
  const imagePath = path.resolve(rootPath, filename);
  const writer = fs.createWriteStream(imagePath);

  const response = await axios.get(url, { responseType: 'stream' });
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

const downloadAudio = async (url: string, filename: string) => {
  const audioPath = path.resolve(rootPath, filename);
  const result = execSync(`youtube-dl "${url}" -o "${audioPath}" --ignore-config`).toString();
  console.log(result);
};

const downloadPage = async () => {
  const response = await axios.get(url);
  const html = response.data;
  // fs.writeFileSync('temp.txt', html);
  // const html: string = fs.readFileSync('temp.txt').toString();
  const root = parse(html);
  const button = root.querySelector(
    'div.article-teaser-info > div > div > button'
  );

  if (!button) {
    throw new Error("Kein Download gefunden")
  }

  // URL
  const audioURL = button.attributes['data-audio'];

  // Date
  const dateStr = audioURL.match(/(\d{4}\/\d{2}\/\d{2})/)
  if (!dateStr) {
    throw new Error("Kein Datum in der URL gefunden")
  }
  const date = dateStr[1].replace(/\//g, '-');

  // Title
  let title = button.attributes['data-audio-download-tracking-title'];
  title = date + ' ' + title.replace('/', '-').replace(/[^\w\-\ \/]/g, '');

  const imageURL = button.attributes['data-audioimage'];
  await downloadImage(imageURL, `${title}.jpg`);
  await downloadAudio(audioURL, `${title}.mp4`);
};

downloadPage();
