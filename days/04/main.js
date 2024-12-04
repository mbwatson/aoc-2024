// Day 04 -- Ceres Search
import 'util/array.mjs';
import 'util/string.mjs';

let inputRows;
let inputCols;

export const part1 = function(input) {
  inputRows = input.length;
  inputCols = input[0].length;

  function read(cell, offset, count) {
    let chars = [];
    let pointer = { ...cell };
    let nextChar = input[pointer.row][pointer.col];
    while (nextChar && chars.length < count) {
      chars.push(nextChar);
      pointer.row += offset.row;
      pointer.col += offset.col;
      nextChar = input?.[pointer.row]?.[pointer.col] ?? null;
    }
    return chars.join('');
  }

  function lookFor(str, { row, col }) {
    const e = read({ row, col }, { row: 0, col: 1 }, str.length);
    const w = read({ row, col }, { row: 0, col: -1 }, str.length);
    const n = read({ row, col }, { row: -1, col: 0 }, str.length);
    const s = read({ row, col }, { row: 1, col: 0 }, str.length);
    const ne = read({ row, col }, { row: -1, col: 1 }, str.length);
    const se = read({ row, col }, { row: 1, col: 1 }, str.length);
    const sw = read({ row, col }, { row: 1, col: -1 }, str.length);
    const nw = read({ row, col }, { row: -1, col: -1 }, str.length);
    const count = [e, w, n, s, ne, se, sw, nw].count('XMAS');
    return count;
  }

  // visit each cell of the 2d matrix.
  // when an 'X' is found, read in each direction.
  // check if it reads 'XMAS'.
  return [...Array(inputRows).keys()].reduce((total, row) => {
    for (let col = 0; col < inputCols; col += 1) {
      if (input[row][col] === 'X') {
        total += lookFor('XMAS', { row, col });
      }
    }
    return total;
  }, 0);
};

// 90-deg rotation
// [1, 0, 1],        [0, 0, 1],
// [0, 1, 1],  --->  [0, 1, 0],
// [0, 0, 1],        [1, 1, 1],
function rotate(matrix) {
  return matrix[0].map((_, colIndex) => 
    matrix.map(row => row[colIndex]).reverse()
  );
}

export const part2 = function(input) {
  const rows = input.map(r => r.split(''));

  function readAround({ col, row }) {
    return [
      rows?.[row - 1].slice(col - 1, col + 2) ?? [],
      rows?.[row].slice(col - 1, col + 2) ?? [],
      rows?.[row + 1].slice(col - 1, col + 2) ?? [],
    ];
  }

  // M.S
  // .A.
  // M.S
  // this is that ^ pattern stringified:
  const xMasPattern = new RegExp(/^M.S.A.M.S$/);

  // visit each cell of the 2d matrix.
  // when an 'A' is found, read around that cell.
  // check if MAS in an X shape, or any of its rotations, is found.
  // can start one row/col in from each edge.
  let count = 0;
  for (let row = 1; row < inputRows - 1; row += 1) {
    for (let col = 1; col < inputCols - 1; col += 1) {
      let window = readAround({ row, col });
      for (let i = 0; i < 4; i += 1) {
        const windowStringified = window.map(r => r.join('')).join('');
        const matches = windowStringified.match(xMasPattern);
        if (matches) { count += 1 };
        window = rotate(window);
      }
    }
  }
  return count;
};
