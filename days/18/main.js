/*
  --- Day 18: RAM Run ---
*/

import { TEST_MODE } from '../../solve.js';
import memoize from 'util/memo.mjs';

function draw(size, blockades, path = []) {
  console.log();
  const digitsRequired = Math.ceil(Math.log(size) / Math.log(10));
  for (let i = 0; i < digitsRequired; i += 1) {
    console.log(Array(digitsRequired).fill(' ').join(''), [...Array(size).keys()].map(n => String(n).padStart(digitsRequired, '0')[i]).join(''));
  }
  for (let y = 0; y < size; y += 1) {
    process.stdout.write(`${ String(y).padStart(digitsRequired, '0') } `);
    for (let x = 0; x < size; x += 1) {
      process.stdout.write(
        blockades.has(hash(x, y)) ? '🮕'
          : path.includes(hash(x, y)) ? '🯇' : '.'
        );
    }
    console.log();
  }
  console.log();
};

const dirs = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }];

function hash(...args) { return args.join(','); }
function unhash(str) { return str.split(',').map(Number); }

class PriorityQueue {
  constructor() {
    this.items = [];
  }
  enqueue(element, priority) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }
  dequeue() {
    return this.items.shift().element;
  }
  isEmpty() {
    return this.items.length === 0;
  }
}

function countSteps(size, blockades) {
  const visited = new Set();
  const distances = new Map();
  distances.set(hash(0, 0), 0);

  function valid({ x, y }) {
    const xyhash = hash(x, y);
    return 0 <= x && x < size && 0 <= y && y < size
      && !blockades.has(xyhash)
      && !visited.has(xyhash);
  }

  const q = [];
  q.push(hash(0, 0));
  while (q.length > 0) {
    const hsh = q.shift();
    const [x, y] = unhash(hsh)
    console.log({ x, y })
    for (let d of dirs) {
      const next = { x: x + d.x, y: y + d.y };
      const nextHash = hash(next.x, next.y);
      if (valid(next)) {
        if (!q.includes(nextHash)) { q.push(nextHash); }
        const newDist = distances.get(hsh) + 1;
        if (newDist < distances.get(nextHash)) { distances.set(nextHash, newDist); }
      }
    }
    visited.add(hash(x, y));
    console.log({q})
    console.log({distances})
  }

  return distances.get(hash(size - 1, size - 1));
}

function findPath(size, blockades, start = { x: 0, y: 0 }, end = { x: size - 1, y: size - 1 }) {

  if (blockades.has(hash(start.x, start.y)) || blockades.has(hash(end.x, end.y))) {
    return null;
  }

  const distances = Array.from({ length: size }, () => Array(size).fill(Infinity));
  const sources = Array.from({ length: size }, () => Array(size).fill(null));

  const pq = new PriorityQueue();
  distances[start.x][start.y] = 0;
  pq.enqueue(start, 0); 

  function valid({ x, y }) {
    return 0 <= x && x < size && 0 <= y && y < size && !blockades.has(hash(x, y));
  }

  while (!pq.isEmpty()) {
    const current = pq.dequeue();

    if (current.x === end.x && current.y === end.y) {
      const resconstructed = [];
      let next = end;
      console.log(current)
      while (next.x !== null && next.y !== null) {
        resconstructed.unshift(next);
        next = sources[next.x][next.y];
      }
    }

    console.log({ current });

    for (let d of dirs) {
      const next = { x: current.x + d.x, y: current.y + d.y };
      console.log('-', next)
      if (valid(next)) {
        const newDist = distances[current.x][current.y] + 1;
        if (newDist < distances[next.x][next.y]) {
          distances[next.x][next.y] = newDist;
          sources[next.x][next.y] = current;
          pq.enqueue(next, newDist);
        }
      }
    }
  }

  return [];
}

export const part1 = function(input) {
  let [size, byteCount] = TEST_MODE ? [7, 12] : [71, 1024];
  const locations = input.slice(0, byteCount);

  const path = findPath(size, new Set(locations));
  draw(size, new Set(locations), path);
  console.log(path)

  return null;
};

export const part2 = function(input) {
  return null;
};
