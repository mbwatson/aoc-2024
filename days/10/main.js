/*
  --- Day 10: Hoof It ---

  part1: 18.348ms
  part2: 1.996ms
  Solutions: { part1: 644, part2: 1366 }

*/

function hash(i, j) { return `${ i },${ j }`; }
function unhash(str) { return str.split(',').map(Number); }

function locateTrailheads(map) {
  const locations = [];
  for (let i = 0; i < map.length; i += 1) {
    for (let j = 0; j < map[0].length; j += 1) {
      map[i][j] === 0 && locations.push([i, j]);
    }
  }
  return locations;
}

function walkTrails(map, trailheads) {
  if (!trailheads.length) return [];

  const rows = map.length;
  const cols = map[0].length;
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  const paths = [];

  function walk(y, x, height, path) {
    path.push([y, x]);
    let canStep = false;

    for (let [dy, dx] of dirs) {
      const next = { y: y + dy, x: x + dx };
      if (
        0 <= next.y && next.y < rows && 0 <= next.x && next.x < cols && // on map
        map[next.y][next.x] === height + 1 // + 1
      ) {
        canStep = true;
        walk(next.y, next.x, height + 1, path);
      }
    }

    if (!canStep) { paths.push([...path]); } // ship it
    
    path.pop();
  }

  for (const [y, x] of trailheads) {
    walk(y, x, 0, []);
  }
  return paths;
}

// function logTrail(trail) {
//   const [heady, headx] = trail[0];
//   console.log();
//   process.stdout.write(`(${heady},${headx}): `);
//   trail.forEach(([y,x], i) => {
//     process.stdout.write(`(${y},${x})`);
//   })
//   process.stdout.write(` -- score: ${trail.length}\n`);
// };

let map, trailheads, trails;

export const part1 = function(input) {
  map = input.map(r => r.split('').map(Number));
  trailheads = locateTrailheads(map);
  trails = walkTrails(map, trailheads);
  const peakCounts = trails
    .filter(t => t.length === 10)
    .reduce((acc, trail) => {
      // logTrail(trail);
      if (hash(...trail[0]) in acc) {
        acc[hash(...trail[0])].add(hash(...trail[9]));
      } else {
        acc[hash(...trail[0])] = new Set([hash(...trail[9])]);
      }
      return acc;
    }, { });
  return Object.values(peakCounts).reduce((sum, peaks) => sum + peaks.size, 0);
};

export const part2 = function(input) {
  const counts = trails
    .filter(t => t.length === 10)
    .reduce((acc, trail) => {
      if (hash(...trail[0]) in acc) {
        acc[hash(...trail[0])] += 1;
      } else {
        acc[hash(...trail[0])] = 1;
      }
      return acc;
    }, { });
  return Object.values(counts).reduce((sum, count) => sum + count, 0);
};
