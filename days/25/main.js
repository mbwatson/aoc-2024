/*
  --- Day 25: undefined ---
*/

function parse(lines) {
  const allZero = Array.from({ length: lines[0].length }).fill(0);

  const encoded = lines.map(l => {
    const bitstring = l.replace(/#/g, '1').replace(/\./g, '0');
    return parseInt(bitstring, 2);
  });


  return encoded;
}

function draw(schematic) {
  let map = [];
  for (let y = 0; y < schematic.length; y += 1) {
    map[y] = Array(schematic.length).fill(0);
    for (let x = 0; x < schematic.length; x += 1) {
      process.stdout.write(schematic[y][x]);
    }
    console.log(map[y].join(''));
  }
}

export const part1 = function(input) {
  const parsed = parse(input);

  // parsed.forEach(schematic => draw(schematic))
  console.log(parsed);

  return null;
};

export const part2 = function(input) {
  return null;
};
