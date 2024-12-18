/*
  --- Day 18: RAM Run ---
*/

import { TEST_MODE } from '../../solve.js';

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
        blockades.has(hash(x, y)) ? '# '
          : path.includes(hash(x, y)) ? '0 ' : '. '
        );
    }
    console.log();
  }
  console.log();
};

const dirs = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }];

function hash(...args) { return args.join(','); }
function unhash(str) { return str.split(',').map(Number); }

function findPath(size, start = { x: 0, y: 0 }, blockades) {
  const end = { x: size - 1, y: size - 1 };

  if (blockades.has(hash(start.x, start.y)) || blockades.has(hash(end.x, end.y))) {
    return null;
  }

  if (hash(start.x, start.y) === hash(end.x, end.y)) { return [start]; }

  const path = [];
  const visited = Array.from({ length: size }, () => Array(size).fill(false));

  function valid({ x, y }) {
    return 0 <= x && x < size && 0 <= y && y < size && !blockades.has(hash(x, y)) && !visited[x][y];
  }

  function backtrack({ x, y }) {
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
  }

  if (backtrack(start)) {
    return path;
  } else {
    return null; // no path
  }
}

export const part1 = function(input) {
  let [size, byteCount] = TEST_MODE ? [7, 12] : [71, 1024];

  const locations = input.slice(0, byteCount);

  return input.slice(0, byteCount).reduce(({ dropped, path }, loc, i) => {
    let newPath = path;
    process.stdout.write(`${ i + 1 } / ${ byteCount }\t\t(${ loc })\t`);
    // draw(size, dropped, path);
    dropped.add(locations[i]);
    let index = path.indexOf(loc);
    // if a byte drops somewhere off-path, it's still a good path.
    if (index > -1) {
      process.stdout.write('✔')
      // otherwise route around: find path from predecessor cell to the end
      const [intx, inty] = unhash(path[index - 1]);
      const pathAround = findPath(size, { x: intx, y: inty }, dropped);
      newPath = [...path.slice(0, index-1), ...pathAround];
    }
    console.log()
    console.log(newPath)
    draw(size, dropped, newPath);
    return { dropped, path: newPath };
  }, {
    dropped: new Set(),
    path: findPath(size, { x: 0, y: 0 }, new Set()),
  }).path.length - 1;
};

export const part2 = function(input) {
  return null;
};

  // draw(size, locations.slice(0, byteCount));
  // draw(size, locations.slice(0, byteCount), p);
  // console.log(p)

    // // if new location landed on our existing path, we
    // // find the shortest path from the cell before it
    // // to end and glue them together.
    // let index = path.indexOf(loc);
    // console.log({ index })
    // if (index === -1) {
    //   return { locations, path };
    // }
    // // it blocks our path. remove the overlapping cell,
    // // and everything after it, replace with path around.
    // console.log(loc, path[index - 1]);
    // const [intx, inty] = unhash(path[index - 1]);
    // const newTail = findPath(size, { x: intx, y: inty }, new Set());
    // // const newPath = [...path.slice(0, index), ...newTail];

    // console.log('- - - - - - - - -');
