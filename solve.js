import arg from 'arg';
import fs from 'node:fs';
import path from 'path';
import { readInputFile } from 'util/read-input.mjs';
import { REAL_INPUT_FILENAME, TEST_INPUT_FILENAME } from './setup.js'

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
const DAY = args['--day'] > 0 ? args['--day'] : null;

const solve = async function(dir, test = false) {
  try {
    // get the solvers
    const { part1, part2 } = await import(`./${ dir }/main.js`);

    // determine which input data to use and get it
    const inputFile = test ? TEST_INPUT_FILENAME : REAL_INPUT_FILENAME;
    const input = readInputFile(`./${ dir }/${ inputFile }`);
    
    // run solvers on appropriate input
    // data, and time their execution.
    console.time('part1');
    const solution1 = part1(input);
    console.timeEnd('part1');

    console.time('part2');
    const solution2 = part2(input);
    console.timeEnd('part2');

    // return solutions object
    return {
      part1: solution1,
      part2: solution2,
    }
  } catch (error) {
    console.log('solver error:', error);
  }
};

(async () => {
  try {
    // bail out if no day is provided
    if (DAY <= 0) {
      throw new Error('day (-d) must by a positive integer!');
    }

    // bail out if given nonexistent solution dir
    const DAY_DIR = padded(DAY);
    if (!fs.statSync(path.join('days', DAY_DIR))) {
      throw new Error(`solution "${ DAY_DIR }" doesn't exist`);
    }
    
    // solve & print solutions
    const solutionPath = path.join('days', DAY_DIR);
    TEST_MODE && console.log('TEST_MODE=true');
    const solutions = await solve(solutionPath, TEST_MODE);
    console.log('Solutions:', solutions);
  } catch (error) {
    console.log('solution read error:', error.message);
  }
})();
