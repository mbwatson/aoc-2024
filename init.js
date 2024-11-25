import arg from 'arg';
import { setupWorkspace } from './setup.js';

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
const DAY = args['--day'] > 0 ? args['--day'] : null;
const TITLE = args['--title'];
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

setupWorkspace(DAY_DIR, TITLE, WRITE_MODE, VERBOSE_MODE);
