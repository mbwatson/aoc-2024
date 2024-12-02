// Day 02 -- Red-Nosed Reports
import 'util/array.mjs';

const isValid = arr => {
  const differences = arr => [...Array(arr.length - 1).keys()].map(i => arr[i+1] - arr[i]);
  const diffs = differences(arr);
  const sign = Math.sign(diffs[0]);
  return diffs.every(d => Math.sign(d) === sign && 1 <= Math.abs(d) && Math.abs(d) <= 3);
};

const parseReport = str => str.split(' ').map(n => Number(n));

export const part1 = function(input) {
  const checks = input.map(report => {
    const values = parseReport(report);
    return isValid(values);
  });
  return checks.count(true);
};

export const part2 = function(input) {
  const checks = input.map(report => {
    const values = parseReport(report);
    return values.some((_, i) => isValid([...values.slice(0, i), ...values.slice(i + 1)]));
  });
  return checks.count(true);
};
