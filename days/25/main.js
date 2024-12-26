/*
  --- Day 25: Code Chronicle ---

  part1: 13.434ms
  part2: 0.018ms
  Solutions: { part1: 3451, part2: null }

  approach: we rotate schematics into arrays of binary numbers.
    keys fitting into locks means corresponding row sums don't exceed
    having "1"s in all places, which -- in this case -- is 127.

  e.g., 0 1111100 (124)      0000011 (3)
        1 1111000 (120)      0000111 (7)
        2 1111100 (124)  ->  0000001 (1)
        3 1000000 (64)       0111111 (63)
        4 1110000 (112)      0001111 (15)
                         ^ fit!

        0 1111110 (126)     0000001 (1)
        1 1000000 (64)      0111111 (63)
        2 1110000 (112)  <- 0001111 (15)
        3 1100000 (96)      0011111 (31)
        4 1111000 (120)     0001111 (15)
             ^     don't fit   ^   sum > 127

*/

function parse(lines) {
  const width = lines[0].length;

  const schematics = { keys: [], locks: [] };
  let current = [];
  let type = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === '') {
      const rotated = rotate(current)
        .map(line => parseInt(line.padStart(7, '0')
          .replace(/#/g, '1')
          .replace(/\./g, '0'), 2));
      schematics[type].push([...rotated]);
      current = [];
      type = null;
    } else {
      if (!type) {
        if (line[0] === '#') { type = 'locks' }
            else { type = 'keys'; }
      }
      current.push(line);
    }
  }
  return schematics;
}

function rotate(strings) {
  if (strings.length === 0) return [];

  const rows = strings.length;
  const cols = strings[0].length;

  const rotated = Array.from({ length: cols }, () => '');

  for (let col = 0; col < cols; col++) {
    for (let row = rows - 1; row >= 0; row--) {
      rotated[col] += strings[row][col];
    }
  }

  return rotated;
}

function draw(schematic) {
  let map = [];
  console.log();
  for (let y = 0; y < schematic.length; y += 1) {
    console.log(
      y,
      schematic[y].toString(2).padStart(7, '0'), 
      parseInt(schematic[y])
    );
  }
  console.log();
}

function fit(key, lock) {
  return key.every((line, i) => line + lock[i] <= 127);
}

export const part1 = function(input) {
  const { keys, locks } = parse([...input, '']);

  let fitCount = 0;
  locks.forEach(lock => {
    keys.forEach(key => {
      // draw(lock);
      // draw(key);
      // console.log('^', fit(key, lock));
      if (fit(key, lock)) {
        fitCount++;
      }
    })
  });

  return fitCount;
};

export const part2 = function(input) {
  return null;
};
