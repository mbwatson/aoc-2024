/*
  --- Day 08: Resonant Collinearity ---
  
  part1: 3.035ms
  part2: 27.122ms
  Solutions: { part1: 295, part2: 1034 }

*/
import 'util/array.mjs';

function locateAntennas(map) {
  return map.reduce((acc, row, y) => {
    row.forEach((char, x) => {
      const key = String(char);
      if (key === '.') {
        return;
      }
      if (key in acc) {
        acc[key].push({ y, x });
        return;
      }
      acc[key] = [{ y, x }];
      return;
    });
    return acc;
  }, {});
};

function findAntinodes(a, b) {
  const d = { y: b.y - a.y, x: b.x - a.x };
  return [
    { y: b.y + d.y, x: b.x + d.x },
    { y: a.y - d.y, x: a.x - d.x },
  ];
};

function findMultipleAntinodes(a, b) {
  const d = { y: b.y - a.y, x: b.x - a.x };
  // significant overcounting
  return [...Array(80).keys()].map(i => i - 40).map(i => [
    { y: b.y + i * d.y, x: b.x + i * d.x },
    { y: a.y - i * d.y, x: a.x - i * d.x },
  ]).flat();
};

let map, antennaMap;

export const part1 = function(input) {
  map = input.map(line => line.split(''));
  antennaMap = locateAntennas(map);
  return Object.keys(antennaMap)
    .map(freq => antennaMap[freq].allPairs()
      .reduce((acc, pair) => {
        const newAntinodes = findAntinodes(...pair)
          .filter(a => input?.[a.y]?.[a.x])
        acc.push(...newAntinodes.map(a => `${a.y},${a.x}`));
        return acc;
      }, [])).flat().unique().length;
};

export const part2 = function(input) {
  return Object.keys(antennaMap)
    .map(freq => antennaMap[freq].allPairs()
      .reduce((acc, pair) => {
        const newAntinodes = findMultipleAntinodes(...pair)
          .filter(a => input?.[a.y]?.[a.x]);
        acc.push(...newAntinodes.map(a => `${a.y},${a.x}`));
        return acc;
      }, [])).flat().unique().length;
};
