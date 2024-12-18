/*
  --- Day 17: Chronospatial Computer ---
*/

function parse(lines) {
  const sep = lines.indexOf('');
  return {
    registers: lines.splice(0, sep).reduce((acc, line) => {
      const matches = line.match(/^Register ([ABC]): (\d+)$/);
      if (matches) { acc[matches[1]] = Number(matches[2]); }
      return acc;
    }, { }),
    program: lines.slice(1).reduce((acc, line) => {
      const matches = line.match(/^Program: (([0-7],?)+)$/);
      if (matches) { acc.push(matches[1].split(',').map(Number)); }
      return acc;
    }, [])[0],
  };
};

export const part1 = function(input) {
  const output = [];
  const { registers, program } = parse(input);

  let pointer = 0;
  const combo = n => [0, 1, 2, 3, registers.A, registers.B, registers.C][n];

  const instructions = [
    /* 0, adv */  n => { registers.A = Math.trunc(registers.A / 2**combo(n)); pointer += 2; },
    /* 1, bxl */  n => { registers.B = Number(n) ^ registers.B;               pointer += 2; },
    /* 2, bst */  n => { registers.B = combo(n) & 7;                          pointer += 2; },
    /* 3, jnz */  n => { pointer = registers.A > 0 ? n : pointer + 2;                       },
    /* 4, bxc */ () => { registers.B = registers.B ^ registers.C;            pointer += 2;  },
    /* 5, out */  n => { output.push(combo(n) & 7);                           pointer += 2; },
    /* 6, bdv */  n => { registers.B = Math.trunc(registers.A / 2**combo(n)); pointer += 2; },
    /* 7, cdv */  n => { registers.C = Math.trunc(registers.A / 2**combo(n)); pointer += 2; },
  ];
  
  console.log({ registers, program });

  let count = 0, failsafe = 10_000;
  while (pointer < program.length && count < failsafe) {
    console.log(count, output.join(',') )
    instructions[program[pointer]](program[pointer + 1])
    count += 1;
  }
  return output.join(',');
};

export const part2 = function(input) {
  return null;
};
