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
      if (matches) { acc[matches[1]] = Number(matches[2]); }
      return acc;
    }, { }),
    program: copy.slice(1).reduce((acc, line) => {
      const matches = line.match(/^Program: (([0-7],?)+)$/);
      if (matches) { acc.push(matches[1].split(',').map(Number)); }
      return acc;
    }, [])[0],
  };
};

function run(registers, program) {
  const output = [];
  let pointer = 0;
  const combo = n => [0, 1, 2, 3, registers.A, registers.B, registers.C][Number(n)];
  const instructions = n => {
    const fns = {
      adv: n => { registers.A = Math.trunc(registers.A >> combo(n)); return pointer + 2; },
      bxl: n => { registers.B ^= n;                                  return pointer + 2; },
      bst: n => { registers.B = combo(n) & 7;                        return pointer + 2; },
      jnz: n => { return registers.A > 0 ? n : pointer + 2;                              },
      bxc: n => { registers.B ^= registers.C;                        return pointer + 2; },
      out: n => { output.push(combo(n) & 7);                         return pointer + 2; },
      bdv: n => { registers.B = Math.trunc(registers.A >> combo(n)); return pointer + 2; },
      cdv: n => { registers.C = Math.trunc(registers.A >> combo(n)); return pointer + 2; },
    }
    return fns[Object.keys(fns)[n]];
  };

  while (pointer < program.length) {
    const prog = program[pointer];
    const comboOp = program[pointer + 1];
    pointer = instructions(prog)(comboOp);
  }

  return output;
}

/*
  essentially:
    a = a >> 3
    output(a % 8)
    a != 0 => jump

  e.g., program 0,3,5,4,3,0 with target = 117440
                :  registers.A  :  output
  a = a >> 3    :    a=14680    :  
  out: a % 8    :               :  0
  a = a >> 3    :    a=1835     :   
  
  given: registers
         Register A: 18427963
         Register B: 0
         Register C: 0
         &
         Program: 2,4,1,1,7,5,0,3,4,3,1,6,5,5,3,0
                  ^   ^   ^   ^   ^   ^   ^   ^
         combo 0->0, 1->1, 2->2, 3->3, 4->a, 5->b, 6->c

  2,4 -- bst : b = a % 8              combo operand (4->a) modulo 8
  1,1 -- bxl : b = b ^ 1              bitwise XOR of register B and the instruction's literal operand
  7,5 -- cdv : c = a >> b             division. numerator is register C, denominator is 2 to the { instruction's combo operand }
  0,3 -- adv : a = a >> 3             division. numerator is register A, denominator is 2 to the { instruction's combo operand }
  4,3 -- bxc : b = b ^ c              bitwise XOR of register B and register C, then stores the result in register B
  1,6 -- bxl : b = b ^ 6              bitwise XOR of register B and the instruction's literal operand
  5,5 -- out : out b % 8              combo operand modulo 8, then outputs that value
  3,0 -- jnz : if a != 0: jump 0      
  
  reverse engineer a working value of `a`:
  

  a in Z_8

  a=0 -> b=0 -> b=1 -> c=0 -> a=0 -> b=1 -> b=7 -> out: 1 / no
  a=1 -> b=1 -> b=0 -> c=1 -> a=0 -> b=1 -> b=7 -> out: 1 / no
  a=2 -> b=2 -> b=3 -> c=0 -> a=0 -> b=3 -> b=5 -> out: 5 / no
  a=3 -> b=3 -> b=2 -> c=0 -> a=0 -> b=2 -> b=4 -> out: 4 / 
  a=4 -> b=4 -> b=5 -> c=0 -> a=0 -> b=5 -> b=3 -> out: 3 / 
  a=5 -> b=5 -> b=4 -> c=0 -> a=0 -> b=4 -> b=2 -> out: 2 / 
  a=6 -> b=6 -> b=7 -> c=0 -> a=0 -> b=7 -> b=1 -> out: 1 /  <-----?
  a=7 -> b=7 -> b=6 -> c=0 -> a=0 -> b=6 -> b=6 -> out: 6 / 

> a=0; b=(((a%8)^1)^c)^6; c=a>>b; a=a>>3;     out 7
> a=1; b=(((a%8)^1)^c)^6; c=a>>b; a=a>>3;     out 6
> a=2; b=(((a%8)^1)^c)^6; c=a>>b; a=a>>3;     out 5
> a=3; b=(((a%8)^1)^c)^6; c=a>>b; a=a>>3;     out 4
> a=4; b=(((a%8)^1)^c)^6; c=a>>b; a=a>>3;     out 3
> a=5; b=(((a%8)^1)^c)^6; c=a>>b; a=a>>3;     out 2
> a=6; b=(((a%8)^1)^c)^6; c=a>>b; a=a>>3;     out 0
> a=7; b=(((a%8)^1)^c)^6; c=a>>b; a=a>>3;     out 6

*/

// function minA(program, ans) {
//   console.log({ program, ans })
//   if (program.length === 0) { return ans; }
//   for (let i of [...Array(8).keys()]) {
//     let a, b, c;
//     console.log({ i })
//     a = ans << 3 + i;
//     b = (a % 8) ^ 1;
//     c = a >> b;
//     a = a >> 3;
//     b = b ^ c;
//     b = b ^ 6;
//     if (b % 8 === program.slice(-1)[0]) {
//       let sub = minA(program.slice(-1), a);
//       if (!sub) continue;
//       return sub;
//     }
//   }
// }

function findMinimumA(program, a = 0, depth = 1) {
  if (depth > program.length) { return a; }
  const target = program.slice(-depth);
  console.log({ depth });
  console.log('  program:', hash(program));
  console.log('   target:', hash(target));

  // explore candidate lowest three bits
  for (let i = 0; i < 8; i += 1) {
    const nextA = (a << 3) | i;
    console.log('registers:', { A: nextA, B: 0, C: 0 });
    const out = run({ A: nextA, B: 0, C: 0 }, target);
    console.log(` ${nextA} ->`, hash(out), `(${out})`);
    // if output matches our target so far, dig deeper
    if (hash(...out) === hash(...target)) {
      console.log(' !! match !!');
      const result = findMinimumA(program, nextA, depth + 1);

      // return result if/when valid value is found
      if (result) { return result; }
    } else {
      console.log(' ...keep going');
    }
  }

  return null;
}

export const part1 = function(input) {
  const { registers, program } = parse(input);
  return run(registers, program).join(',');
};

export const part2 = function(input) {
  const { registers, program } = parse(input);
  console.log({ registers, program })

  const output = run(registers, program);
  console.log({ output })
  
  return findMinimumA(output, 0);
};
