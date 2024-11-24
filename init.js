import arg from 'arg';
import fs from 'node:fs';
import path from 'path';
import templates from './templates.js';

const padded = num => String(num).padStart(2, '0');

const args = arg({
  // types
  '--day': Number,
  '--pretend': Boolean,
  '--title': String,
  '--verbose': Boolean,
  // aliases
  '-d': '--day',
  '-t': '--title',
  '-p': '--pretend',
  '-v': '--verbose',
});
/*
  defaults
  - VERBOSE_MODE=true : console.log more
  - WRITE_MODE=true : save generated files to disk
*/
const DAY = args['--day']  > 0 ? args['--day'] : null;
const TITLE = args['--title'] ?? null;
let VERBOSE_MODE = false;
let WRITE_MODE = true;
if (args['--verbose']) { VERBOSE_MODE = true; }
if (args['--pretend']) { WRITE_MODE = false; }

VERBOSE_MODE && console.log(`Config:
- DAY: ${ DAY }
- TITLE: ${ TITLE }
- VERBOSE_MODE: ${ VERBOSE_MODE }
- WRITE_MODE: ${ WRITE_MODE }
`);

// bail out if no day is provided
if (DAY <= 0) {
  console.log('day (-d) must by a positive integer!');
}

// use zero-added day string for module dir
const DAY_DIR = padded(DAY);

setupWorkspace(DAY_DIR);

//

function setupWorkspace(dirName) {
  const dirPath = path.join('days', dirName);
  const writeFile = (filename, content) => fs.writeFileSync(path.join(dirPath, filename), content);
  const contentPreview = text => console.log('║ ' + text.trim().split('\n').join('\n║ ')+'\n╙──────────');

  console.log(`target dir: ./${ dirPath }`);
  WRITE_MODE && fs.mkdirSync(dirPath);

  console.log(`╓┤${ dirPath }/main.js`);
  const mainJs = templates.mainJs.replace('{{DAY}}', TITLE
    ? `${ dirName } -- ${ TITLE }`
    : dirName
  );
  VERBOSE_MODE && contentPreview(mainJs);
  WRITE_MODE && writeFile('main.js', templates.mainJs.replace('{{DAY}}', dirName));

  console.log(`╓┤${ dirPath }/test-input.txt`);
  VERBOSE_MODE && contentPreview(templates.testInput);
  WRITE_MODE && writeFile('test-input.txt', templates.testInput);

  console.log(`╓┤${ dirPath }/real-input.txt`);
  VERBOSE_MODE && contentPreview(templates.realInput);
  WRITE_MODE && writeFile('real-input.txt', templates.realInput);

  WRITE_MODE
   ? console.log('\n * 1 dir, 3 files written to disk *')
   : console.log('\n * nothing written to disk -- WRITE_MODE=false (-p) *')
}

