/*
  --- Day 22: Monkey Market ---

  part1: 565.747ms
  part2: 
  Solutions: { part1: 15303617151n, part2:  }

*/


const mult64 = n => n << 6n;
const div32 = n => n >> 5n;
const mult2048 = n => n << 11n;
const mix = (n1, n2) => n1 ^ n2;
const prune = n => (n + (1n << 24n)) & ((1n << 24n) - 1n);

function* evolve(init) {
  let result = init;
  while (true) {
    yield result;
    result = prune(mix(mult64(result), result));
    result = prune(mix(div32(result), result));
    result = prune(mix(mult2048(result), result));
  }
}

export const part1 = function(input) {
  const initials = input.map(BigInt);
  return initials.reduce((acc, initial) => {
    const secrets = evolve(initial);
    let secret = secrets.next();
    for (let i = 0; i < 2000; i++) {
      secret = secrets.next().value;
    }
    acc += secret;
    return acc;
  }, 0n);
};

export const part2 = function(input) {
  const initials = input.map(BigInt);
  return initials.reduce((acc, initial) => {
    const secrets = [...evolve(initial];
    console.log(secrets);
    console.log(secrets.length);
  }, 0n);
};
