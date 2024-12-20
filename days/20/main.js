/*
  --- Day 20: Race Condition ---
*/

import memoize from 'util/memo.mjs';

const hash = memoize(function(i, j) { return `${ i },${ j }`; });
function unhash(str) {
  const [x, y] = str.split(',').map(Number);
  return { x, y };
}

function survey(lines) {
  const [width, height] = [lines[0].length, lines.length];
  const map = lines.reduce((acc, line, y) => {
    for (let x = 0; x < line.length; x += 1) {
      const ch = line[x];
      if (ch in acc) {
        acc[ch].add(hash(x, y));
      } else {
        acc[ch] = new Set([hash(x, y)]);
      }
    }
    return acc;
  }, {});
  return {
    walls: map['#'],
    floor: map['.'],
    height: lines.length,
    width: lines[0].length,
    start: unhash([...map.S][0]),
    end: unhash([...map.E][0]),
    lines,
  };
}

function draw({ height, width, start, end, walls = new Set(), path = [] }) {
  console.log();
  const digitsRequired = Math.ceil(Math.log(width) / Math.log(10));
  for (let i = 0; i < digitsRequired; i += 1) {
    console.log(
      Array(digitsRequired).fill(' ').join(''),
      [...Array(width).keys()].map(n => String(n).padStart(digitsRequired, '0')[i])
      .join('')
    );
  }
  for (let y = 0; y < height; y += 1) {
    process.stdout.write(`${ String(y).padStart(digitsRequired, '0') } `);
    for (let x = 0; x < width; x += 1) {
      process.stdout.write(
        walls.has(hash(x, y)) ? '░'
          : hash(x, y) === hash(start.x, start.y) ? 'S'
          : hash(x, y) === hash(end.x, end.y) ? 'E'
          : path.includes(hash(x, y)) ? '🯇'
          : '.'
        );
    }
    console.log();
  }
  console.log();
};

const dirs = [{ x: 0, y: 1 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: -1, y: 0 }];

function findPath({ height, width, start, end, walls = new Set() }) {
  const visited = new Set();
  let current = start;
  let path = [start];

  const valid = ({ x, y }) => 0 <= x && x < width && 0 <= y < height && !walls.has(hash(x, y)) && !visited.has(hash(x, y));
  while (hash(current.x, current.y) !== hash(end.x, end.y)) {
    visited.add(hash(current.x, current.y));
    const { next } = dirs.reduce((acc, d, i) => {
      let neighbor = { x: current.x + d.x, y: current.y + d.y };
      if (valid(neighbor)) {
        acc.next = neighbor;
      }
      return acc;
    }, { next: null });
    path.push(next);
    current = next;
  }
  return path;
}

const dist = (a, b) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

function findCheats({ height, width, walls, path, radius = 1 }) {
  const valid = ({ x, y }) => 0 <= x && x < width && 0 <= y < height && !walls.has(hash(x, y));
  const visited = new Set();
  const neighborhoods = path.reduce((acc, { x, y }) => {
    const neighbors = path.filter(n => dist({ x, y }, n) === radius);
    acc[hash(x, y)] = new Set(neighbors);
    return acc;
  }, { });
  console.log(neighborhoods);
  return Object.values(neighborhoods)
    .reduce((cheatCount, { x, y, neighbors }) => {
      console.log({ x, y, neighbors });
      neighbors.forEach(nbr => {
        const startIndex = path.findIndex(s => s.x === x && s.y === y);
        const endIndex = path.findIndex(s => s.x === nbr.x && s.y === nbr.y);
        const savings = endIndex - startIndex - 1;
        if (savings >= 100) { cheatCount += 1; }
      });
      return cheatCount;
    }, 0);
}

export const part1 = function(input) {
  const { start, end, walls, height, width } = survey(input);
  draw({ height, width, walls, start, end });
  const path = findPath({ height, width, start, end, walls });
  const cheats = findCheats({ height, width, walls, path });
  console.log({cheats})
  return 'path';
};

export const part2 = function(input) {
  return null;
};
