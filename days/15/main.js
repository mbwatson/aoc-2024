/*
  --- Day 15: Warehouse Woes ---
*/

function widen(map) {
  return [...map].map((line, y) => {
    for (let x = 0; x < line.length; x += 1) {
      return line.replace(/O/g, '[]')
        .replace(/#/g, '##')
        .replace(/@/g, '@@')
        .replace(/\./g, '..')
        .replace(/@@/g, '@.');
    }
  });
}

function parse(lines, doubleWide = false) {
  const sep = lines.indexOf('');
  const copy = doubleWide ? widen([...lines]) : [...lines];
  console.log(lines, [...copy.slice(1).flat()][0].split(''));
  return {
    map: copy.splice(0, sep),
    // skipping that indexed blank line, everything else is moves
    moves: [...copy.slice(1)].reduce((acc, line) => acc.concat(line.split('')), []),
  };
}

function draw(map) {
  const room = {
    width: map[0].length,
    height: map.length,
  };
  const digitsRequired = Math.ceil(Math.log(map[0].length) / Math.log(10));
  for (let i = 0; i < digitsRequired; i += 1) {
    console.log(
      Array(digitsRequired).fill(' ').join(''),
      [...Array(map.length).keys()].map(n => String(n).padStart(digitsRequired, '0')[i]).join(' ')
    );
  }
  for (let y = 0; y < room.height; y += 1) {
    console.log(String(y).padStart(digitsRequired, '0'), [...map[y]].join(' '))
  }
  console.log();
};

function rotateMap(map, dir) {
  if (dir === '<') return map.map((ch, i) => map.map(row => row[i]).reverse()); // cw
  if (dir === '>') return map.map((ch, i) => map.map(row => row[row.length - i - 1])); // ccw
  if (dir === 'v') return rotateMap(rotateMap(map, '>'), '>'); // 180
  if (dir === '^') return map; // none
  return map;
};

function robotLocation(map) {
  return map.reduce((acc, line, y) => {
    const x = line.indexOf('@');
    if (x === -1 || !!acc) return acc;
    acc = { x, y };
    return acc;
  }, null);
};

function step(map, { x, y }) {
  const mapCopy = [...map];
  const room = {
    width: map[0].length,
    height: map.length,
  };

  // if able, make move/modify map
  if (mapCopy[y - 1][x] === '.') {
    console.log('✔', { x, y: y - 1 });
    const temp = mapCopy[y - 1][x];
    mapCopy[y - 1][x] = mapCopy[y][x];
    mapCopy[y][x] = temp;
    return mapCopy;
  }
  if (mapCopy[y - 1][x] === '#') {
    console.log('☒', { x, y: y - 1 });
    return false;
  }
  if (mapCopy[y - 1][x] === 'O') {
    console.log('☐', { x, y });
    if (step(mapCopy, { x, y: y - 1 })) {
      const temp = mapCopy[y - 1][x];
      mapCopy[y - 1][x] = mapCopy[y][x];
      mapCopy[y][x] = temp;
      return mapCopy;      
    }
  }

  return false;
};

function gps(map) {
  return map.reduce((acc, line, y) => {
    for (let x = 0; x < line.length; x += 1) {
      if (line[x] === 'O') {
        acc += 100 * y + x;
      }
    }
    return acc;
  }, 0);
};

export const part1 = function(input) {
  let { map, moves } = parse(input);
  console.log(moves, moves.length);

  draw(map);

  moves.forEach(move => {
    console.log('move:', move, '\n');
    map = rotateMap(map, move);
    step(map, robotLocation(map));
    map = rotateMap(rotateMap(rotateMap(map, move), move), move);
    draw(map);
  })

  return gps(map);
};

export const part2 = function(input) {
  const { map, moves } = parse(input, true);
  console.log(map);
  console.log(moves);
  return null;
};
