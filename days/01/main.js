// Day 01 -- Historian Hysteria
import 'util/array.mjs';
import { unzip, zip } from 'util/zip.mjs';

let pairs, left, right;

export const part1 = function(input) {
  pairs = input.map(str => str.split(/ +/).map(s => Number(s)));
  [left, right] = unzip(pairs).map(p => p.sort());
  const differences = left.map((n, i) => Math.abs(right[i] - n));
  const total = differences.reduce((sum, n) => sum + n, 0);
  return total;
};

export const part2 = function(input) {
  return left.reduce((acc, n) => acc + n * right.count(n), 0);
};
