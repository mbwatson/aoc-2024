/*
  --- Day 11: Plutonian Pebbles ---

  part1: 7.355ms
  part2: 163.142ms
  Solutions: { part1: 203953, part2: 242090118578155 }
  
*/

import memoize from 'util/memo.mjs';

function parse(input) {
  return input[0].split(' ').map(Number)
    .reduce((acc, stone) => {
      acc.set(stone, 1);
      return acc;
    }, new Map());  
};

const countStones = memoize(function(blinks = 1, stone) {
  if (blinks === 0) {
    return 1;
  }

  const stoneString = String(stone);
  
  if (stone === 0) { return countStones(blinks - 1, 1); }

  if (stoneString.length % 2 === 0) {
    const center = stoneString.length / 2;
    const left = Number(stoneString.slice(0, center));
    const right = Number(stoneString.slice(center));
    return countStones(blinks - 1, left) + countStones(blinks - 1, right);
  }
  
  return countStones(blinks - 1, stone * 2024);
});

export const part1 = function(input, blinks = 25) {
  const stones = parse(input);
  return [...stones.keys()].reduce((sum, stone) => sum + countStones(blinks, stone), 0);
};

export const part2 = function(input) {
  return part1(input, 75);
};
