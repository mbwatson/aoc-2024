/*
  --- Day 09: Disk Fragmenter ---
*/

import 'util/array.mjs';

function decode(str) {
  let count = 0;
  return str.split('').reduce((acc, block, i) => {
    if (i % 2) {
      acc.push(...Array(+block).fill('.'));
      return acc;
    }
    acc.push(...Array(+block).fill(count));
    count += 1;
    return acc;
  }, []);
};

export const part1 = function(input) {
  const encoded = input[0];         // 2333133121414131402
  const blocks = decode(encoded);   // 00...111...2...333.44.5555.6666.777.888899
  let pointer = blocks.length - 1;
  let i = blocks.findIndex(block => block === '.');
  while (i < pointer) {
    if (blocks[i] === '.') {
      while (blocks[pointer] === '.') {
        pointer -= 1;
      }
      blocks[i] = blocks[pointer];
      blocks[pointer] = '.';
    }
    i += 1;
  }
  const vec = blocks.reduce((acc, ch) => {
    if (ch !== '.') { acc.push(ch); }
    return acc;
  }, []);
  const nArray = Array.prototype.upTo(vec.length);
  return vec.dotProduct(nArray);
};

function leftFree(d, index) {
  return d.join('')[index] === '.'
    ? d.slice(0, index + 1).match(/\.+$/)
    : 0;
};

export const part2 = function(input) {
  // const encoded = input[0];          // 2333133121414131402
  // const decoded = decode(encoded);   // 00...111...2...333.44.5555.6666.777.888899
  // for (let i = decoded.length - 1; i >= 0; i -= 1) {
  //   console.log(decoded);
  //   for (let j = 1; j < i; j += 1) {
  //     ...
  //   }
  // }
  return null;
};
