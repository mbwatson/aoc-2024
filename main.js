import arg from 'arg';
import fs from 'node:fs';
import path from 'path';
import { solve } from './solve.js';

const padded = num => String(num).padStart(2, '0');

const args = arg({
  // types
  '--day': Number,
  '--test': Boolean,
  // aliases
  '-d': '--day',
  '-t': '--test',
});

let TEST_MODE = false;
if (args['--test']) { TEST_MODE = true; }
const DAY = args['--day']  > 0 ? args['--day'] : null;

(async () => {
  try {
    // bail out if no day is privided
    if (DAY <= 0) {
      throw new Error('day (-d) must by a positive integer!');
    }

    // bail out if given nonexistent module dir
    const DAY_DIR = padded(DAY);
    if (!fs.statSync(path.join('days', DAY_DIR))) {
      throw new Error(`module "${ DAY_DIR }" doesn't exist`);
    }
    
    // solve & print solutions
    const modulePath = path.join('days', DAY_DIR);
    TEST_MODE && console.log('TEST_MODE=true');
    const solutions = await solve(modulePath, TEST_MODE);
    console.log(solutions)
  } catch (error) {
    console.log('module read error:', error.message);
  }
})();
