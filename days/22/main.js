/*
  --- Day 22: Monkey Market ---

  part1: 565.747ms
  part2: 
  Solutions: { part1: 15303617151n, part2:  }

*/

import { unzip } from 'util/zip.mjs';

const mult64 = n => n << 6n;
const div32 = n => n >> 5n;
const mult2048 = n => n << 11n;
const mix = (n1, n2) => n1 ^ n2;
const prune = n => (n + (1n << 24n)) & ((1n << 24n) - 1n);

function* evolve(init, iterations = 1) {
  let result = init;
  let i = 0;
  while (i <= iterations) {
    yield result;
    result = prune(mix(mult64(result), result));
    result = prune(mix(div32(result), result));
    result = prune(mix(mult2048(result), result));
    i += 1;
  }
}

export const part1 = function(input) {
  return input.map(BigInt)
    .reduce((acc, init) => {
      const secrets = [...evolve(init, 2000)];
      return acc + secrets.slice(-1)[0];
    }, 0n);
};

function maxBigInt(...values) {
  return values.reduce((max, current) => (current > max ? current : max));
}

// find min index where the max digit repeats
// return the sewuence of digits to watch for
// before the next max appears

Array.prototype.diffs = function({ pad }) {
  return this.reduce((acc, x, i) => {
    if (i === 0) {
      return acc;
    }
    acc.push(this[i] - this[i - 1]);
    if (i === this.length - 1) {
      return acc;
    }
    return acc;    
  }, []);
}

function findSequence(arr) {
  console.log(arr);
  const max = maxBigInt(...arr);
  const maxi = arr.indexOf(max);
  const maxii = arr.slice(maxi + 1).indexOf(max) + maxi + 1;
  console.log({ max, maxi, maxii, });
  const d = arr.diffs({ pad: 0n }).slice(maxi, maxii);
  return d;
}

export const part2 = function(input) {
  const sequenceMap = input.map(BigInt)
    .reduce((acc, init) => {
      const secrets = [...evolve(init, 10)];
      const ones = secrets.reduce((acc, x, i) => {
        const z = x % 10n;
        acc.push(z);
        return acc;
      }, []);
      acc[init] = findSequence(ones);
      return acc;
    }, { });
  return sequenceMap;
}
