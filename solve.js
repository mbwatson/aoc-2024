import arg from 'arg';
import fs from 'node:fs';
import path from 'path';
import { readFileLines } from 'util/read-file-lines.mjs';
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
const DAY = args['--day']  > 0 ? args['--day'] : null;

const solve = async function(dir, test = false) {
  try {
    // get the solvers
    const { part1, part2 } = await import(`./${ dir }/main.js`);

    // determine which input data to use and get it
    const inputFile = test ? TEST_INPUT_FILENAME : REAL_INPUT_FILENAME;
    const input = readFileLines(`./${ dir }/${ inputFile }`);
    
    // run solvers on appropriate input data
    // and return solutions object
    return {
      part1: part1(input),
      part2: part2(input),
    }
  } catch (error) {
    console.log('solver error:', error.message)
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
    console.log(solutions);
  } catch (error) {
    console.log('solution read error:', error.message);
  }
})();
