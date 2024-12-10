/*
  --- Day 10: Hoof It ---

  part1: 18.348ms
  part2: 1.263ms
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

function walkTrails(map) {
  const trailheads = locateTrailheads(map);
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

let map, trails;

export const part1 = function(input) {
  map = input.map(r => r.split('').map(Number));
  trails = walkTrails(map).filter(t => t.length === 10);
  const peakCounts = trails
    .reduce((acc, trail) => {
      // logTrail(trail);
      const hashedLocation = hash(...trail[0]);
      if (hashedLocation in acc) {
        acc[hashedLocation].add(hash(...trail[9]));
      } else {
        acc[hashedLocation] = new Set([hash(...trail[9])]);
      }
      return acc;
    }, { });
  return Object.values(peakCounts).reduce((sum, peaks) => sum + peaks.size, 0);
};

export const part2 = function(input) {
  const pathCounts = trails
    .reduce((acc, trail) => {
      const hashedLocation = hash(...trail[0]);
      if (hashedLocation in acc) {
        acc[hashedLocation] += 1;
      } else {
        acc[hashedLocation] = 1;
      }
      return acc;
    }, { });
  return Object.values(pathCounts).reduce((sum, count) => sum + count, 0);
};
