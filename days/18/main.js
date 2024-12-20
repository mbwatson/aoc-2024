/*
  --- Day 18: RAM Run ---
*/

import { TEST_MODE } from '../../solve.js';
import memoize from 'util/memo.mjs';

function draw(size, blockades, path = []) {
  console.log();
  const digitsRequired = Math.ceil(Math.log(size) / Math.log(10));
  for (let i = 0; i < digitsRequired; i += 1) {
    console.log(Array(digitsRequired).fill(' ').join(''), [...Array(size).keys()].map(n => String(n).padStart(digitsRequired, '0')[i]).join(' '));
  }
  for (let y = 0; y < size; y += 1) {
    process.stdout.write(`${ String(y).padStart(digitsRequired, '0') } `);
    for (let x = 0; x < size; x += 1) {
      process.stdout.write(
        blockades.has(hash(x, y)) ? '🮕 '
          : path.includes(hash(x, y)) ? '🯇 ' : '. '
        );
    }
    console.log();
  }
  console.log();
};

const dirs = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }];

function hash(...args) { return args.join(','); }
function unhash(str) { return str.split(',').map(Number); }

function findPath(size, blockades, start = { x: 0, y: 0 }, end = { x: size - 1, y: size - 1 }) {

  if (blockades.has(hash(start.x, start.y)) || blockades.has(hash(end.x, end.y))) {
    return null;
  }

  if (hash(start.x, start.y) === hash(end.x, end.y)) { return [start]; }

  const path = [];
  const visited = Array.from({ length: size }, () => Array(size).fill(false));

  function valid({ x, y }) {
    return 0 <= x && x < size && 0 <= y && y < size && !blockades.has(hash(x, y)) && !visited[x][y];
  }

  const backtrack = function({ x, y }) {
    if (x === end.x && y === end.y) {
      path.push(hash(x, y));
      return true;
    }

    visited[x][y] = true;
    path.push(hash(x, y));

    for (let d of dirs) {
      const next = { x: x + d.x, y: y + d.y };
      if (valid(next)) {
        if (backtrack(next)) {
          return true; // found a path
        }
      }
    }

    path.pop();
    visited[x][y] = false;
    return false;
  };

  if (backtrack(start)) {
    return path;
  } else {
    return null; // no path
  }
}

export const part1 = function(input) {
  let [size, byteCount] = TEST_MODE ? [7, 12] : [71, 1024];
  const locations = input.slice(0, byteCount);

  const path = findPath(size, new Set(locations), { x: 0, y: 0 }, { x: size - 1, y: size - 1 });
  console.log(path.length - 1);

  return input.slice(0, byteCount).reduce(({ dropped, path }, locHash, i) => {
    let newPath = path;
    process.stdout.write(`     ${ i + 1 } / ${ byteCount } (${ locHash }) `);
    dropped.add(locations[i]);
    let index = path.indexOf(locHash);
    // if a byte drops somewhere off-path, our path is still good.
    if (index > -1) {
      // ...otherwise
      process.stdout.write('\t ❌ hit. ')
      draw(size, dropped, path);
      // otherwise route around: find path from predecessor cell to the end
      const [intx, inty] = unhash(path?.[index - 4] || path[index - 1]);
      process.stdout.write(`recalculate paths START--(${intx},${inty}) and (${intx},${inty})--END `);
      const head = findPath(size, dropped, { x: 0, y: 0 }, { x: intx, y: inty });
      const tail = findPath(size, dropped, { x: intx, y: inty }, { x: size - 1, y: size - 1 });
      // the two path parts may share squares
      const commonSquares = [...head.filter(h => tail.indexOf(h) > -1)];
      const headIndex = head.indexOf(commonSquares[0]);
      const tailIndex = tail.lastIndexOf(commonSquares[0]);
      console.log({ headIndex, tailIndex });
      console.log('head', head.join(' -- '), `(${ headIndex })`);
      console.log('tail', tail.join(' -- '), `(${ tailIndex })`);
      // glue the earliest one in head to the latest in tail
      newPath = [...head.slice(0, headIndex), ...tail.slice(tailIndex)];
      console.log('   =', newPath.join(' -- '));
      draw(size, dropped, newPath);
    }
    console.log();
    return { dropped, path: newPath };
  }, {
    dropped: new Set(),
    path: findPath(size, new Set(), { x: 0, y: 0 }, { x: size - 1, y: size - 1 }),
  }).path.length - 1;
};

export const part2 = function(input) {
  return null;
};
