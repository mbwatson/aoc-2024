/* Day 05 -- Print Queue */

import 'util/array.mjs';

function decodeOrder(arr) {
  return arr.map(p => p.split('|').map(s => +s))
    .reduce((acc, [a, b]) => {
      if (a in acc) { acc[a].push(b) }
        else { acc[a] = [b]; }
      return acc;
    }, []);
}

function isValid(order, arr) {
  return [...Array(arr.length - 1).keys()]
    .every(i => order[arr[i]] && order[arr[i]].includes(arr[i+1]));
};

let order;
let updates;

export const part1 = function(input) {
  const [orderStrings, updateStrings] = input.split(input.indexOf(''));
  order = decodeOrder(orderStrings);
  updates = updateStrings.map(update => update.split(',').map(s => +s));

  return updates
    .filter(update => isValid(order, update))
    .reduce((sum, update) => sum + update[(update.length - 1) / 2], 0);
};

export const part2 = function(input) {
  return updates
    .filter(update => !isValid(order, update))
    .reduce((sum, update) => {
      const validUpdate = update.sort((a, b) => order[a] && order[a].includes(b) ? -1 : 1)
      return sum + validUpdate[(update.length - 1) / 2]
    }, 0);
};
