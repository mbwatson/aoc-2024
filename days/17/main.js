/*
  --- Day 17: Chronospatial Computer ---
*/

function hash(...args) { return args.join(','); }

function parse(lines) {
  const sep = lines.indexOf('');
  const copy = [...lines];
  return {
    registers: copy.splice(0, sep).reduce((acc, line) => {
      const matches = line.match(/^Register ([ABC]): (\d+)$/);
      if (matches) { acc[matches[1]] = BigInt(matches[2]); }
      return acc;
    }, { }),
    program: copy.slice(1).reduce((acc, line) => {
      const matches = line.match(/^Program: (([0-7],?)+)$/);
      if (matches) { acc.push(matches[1].split(',').map(BigInt)); }
      return acc;
    }, [])[0],
  };
};

function run(registers, program) {
  const output = [];
  let pointer = 0n;
  const combo = n => [0n, 1n, 2n, 3n, registers.A, registers.B, registers.C][Number(n)];
  console.log(combo(0n));
  console.log(combo(1n));
  console.log(combo(2n));
  console.log(combo(3n));
  console.log(combo(4n));
  console.log(combo(5n));
  console.log(combo(6n));
  console.log(combo(7n));
  const instructions = [
    n => { console.log('(0) adv', {pointer, registers}, n, typeof n, '::'); registers.A = registers.A >> combo(n);      pointer += 2n;  }, /* 0, adv */
    n => { console.log('(1) bxl', {pointer, registers}, n, typeof n, '::'); registers.B ^= n;                              pointer += 2n;  }, /* 1, bxl */
    n => { console.log('(2) bst', {pointer, registers}, n, typeof n, '::'); registers.B = combo(n) & 7n;                   pointer += 2n;  }, /* 2, bst */
    n => { console.log('(3) jnz', {pointer, registers}, n, typeof n, '::'); pointer = registers.A > 0n ? n : pointer + 2n;                 }, /* 3, jnz */
   () => { console.log('4, bxc', {pointer, registers});                     registers.B ^= registers.C;                    pointer += 2n;  }, /* 4, bxc */
    n => { console.log('(5) out', {pointer, registers}, n, typeof n, '::'); output.push(combo(n) & 7n);                    pointer += 2n;  }, /* 5, out */
    n => { console.log('(6) bdv', {pointer, registers}, n, typeof n, '::'); registers.B = registers.A >> combo(n);      pointer += 2n;  }, /* 6, bdv */
    n => { console.log('(7) cdv', {pointer, registers}, n, typeof n, '::'); registers.C = registers.A >> combo(n);      pointer += 2n;  }, /* 7, cdv */
  ];

  while (pointer < program.length) {
    console.log(` - program[pointer] = program[${ pointer }] =`, program[pointer], typeof pointer, typeof program[pointer])
    instructions[program[pointer]](program[pointer + 1n]);
  }

  return output;
}

function findMinimumA(program, a = 0n, depth = 1) {
  if (depth > program.length) { return a; }

  // explore candidate lowest three bits
  for (let i = 0n; i < 8n; i += 1n) {
    console.log({ i, depth, a });
    const nextA = (a << 3n) | i;
    const out = run({ A: nextA, B: 0n, C: 0n }, program);
    const target = program.slice(-depth);
    console.log('-', { nextA, target, out });

    // if output matches our target so far, dig deeper
    if (hash(out) === hash(target)) {
      const result = findMinimumA(program, nextA, depth + 1);

      // return result if/when valid value is found
      if (result) { return result; }
    }
  }

  return null;
}

export const part1 = function(input) {
  const { registers, program } = parse(input);
  console.log({ registers, program })
  return run(registers, program).join(',');
};

export const part2 = function(input) {
  const { registers, program } = parse(input);

  const output = run(registers, program);
  console.log({ output })
  
  return findMinimumA(output);
};


  // const instructions = n => {
  //   const functions = {
  //     adv: () => registers.A = registers.A >> combo(n),
  //     bxl: () => registers.B ^= n,
  //     bst: () => registers.B = combo(n) & 7n,
  //     jnz: () => pointer = registers.A > 0n ? n : pointer,
  //     bxc: () => registers.B ^= registers.C,
  //     out: () => output.push(combo(n) & 7n),
  //     bdv: () => registers.B = registers.A >> combo(n),
  //     cdv: () => registers.C = registers.A >> combo(n),
  //   };
  //   pointer += 2n;
  //   return Object.keys(functions)[n];
  // };
