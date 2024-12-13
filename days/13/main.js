/*
  --- Day 13: Claw Contraption ---
*/

import * as math from 'mathjs';

function parse(input) {
  const behaviorPattern = new RegExp(/^Button ([A-Z]{1}): X\+(\d+), Y\+(\d+)$/);
  const prizePattern = new RegExp(/^Prize: X=(\d+), Y=(\d+)$/);
  let config = [];
  for (let i = 0; i < input.length; i += 4) {
    const a = input[i].match(behaviorPattern).slice(2, 4).map(Number);
    const b = input[i+1].match(behaviorPattern).slice(2, 4).map(Number);
    const prize = input[i+2].match(prizePattern).slice(1, 3).map(Number);
    config.push({ a, b, prize });
  };
  return config;
};

function nearlyInteger(num) {
  const episilon = 0.00000000001;
  const rounded = Math.round(num);
  return Math.abs(num - rounded) < episilon;
};

function solve(a, b, prize) {
  const basis = math.matrix([a, b]);
  const soln = math.matrix(prize);
  const [c1, c2] = math.multiply(soln, math.inv(basis))._data;
  return (nearlyInteger(c1) && nearlyInteger(c2)) ? [Math.round(c1), Math.round(c2)] : null;
};

export const part1 = function(input, prizeTranslation = math.matrix([0, 0])) {
  const solutions = [];
  const config = parse(input);
  config.forEach(({ a, b, prize }) => {
    const soln = solve(a, b, math.add(prize, prizeTranslation) );
    if (soln) solutions.push(soln);
  });
  return solutions.reduce((cost, soln) => {
    return cost += 3 * soln[0] + soln[1];
  }, 0);
};

export const part2 = function(input) {
  return part1(input, math.matrix([10000000000000, 10000000000000]));
};
