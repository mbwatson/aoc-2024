/*
  --- Day 22: Monkey Market ---
*/


function evolve(secret) {
  const mult64 = n => n << 6n;
  const div32 = n => n >> 5n;
  const mult2048 = n => n << 11n;
  const mix = (n1, n2) => n1 ^ n2;
  const prune = n => (n + (1n << 24n)) & ((1n << 24n) - 1n);

  let result;
  result = prune(mix(mult64(secret), secret));
  result = prune(mix(div32(result), result));
  result = prune(mix(mult2048(result), result));
  return result;
}

export const part1 = function(input) {

  const initials = input.map(BigInt);
  return initials.reduce((acc, initial) => {
    let result = initial;
    for (let i = 0; i < 2000; i++) {
      result = evolve(result);
    }
    acc.push([initial, result])
    return acc;
  }, []).reduce((sum, [init, n]) => sum + n, 0n);
};

export const part2 = function(input) {
  return null;
};
