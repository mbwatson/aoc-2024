import { readFileLines } from 'util/read-file-lines.mjs';

const TEST_INPUT_FILENAME = `test-input.txt`;
const REAL_INPUT_FILENAME = `real-input.txt`;

export const solve = async function(dir, test = false) {
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
}
