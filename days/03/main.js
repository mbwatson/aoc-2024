// Day 03 -- Mull It Over

const evaluateInstruction = instruction => {
  // in: mul(2,4), out: 8
  const pattern = new RegExp(/mul\((\d{1,3}),(\d{1,3})\)/);
  const matches = instruction.match(pattern);
  const factors = matches.slice(1, 3).map(n => Number(n))
  return factors[0] * factors[1];
};

let memory;

export const part1 = function(input) {
  memory = input.join('-');
  const pattern = new RegExp(/mul\(\d{1,3},\d{1,3}\)/g);
  const matches = memory.match(pattern);
  return matches.reduce((sum, instr) => {
    return sum + evaluateInstruction(instr);
  }, 0);
};

export const part2 = function(input) {
  const pattern = new RegExp(/(mul\((\d{1,3}),(\d{1,3})\)|do\(|don\'t\()/g);
  const matches = memory.match(pattern);
  const { total } = matches.reduce((acc, instr) => {
    if (instr.startsWith('don')) {
      acc.on = false;
    } else if (instr.startsWith('do(')) {
      acc.on = true;
    } else if (instr.startsWith('mul') && acc.on) {
      acc.total += evaluateInstruction(instr);
    }
    return acc;
  }, { on: true, total: 0 });
  return total;
};
