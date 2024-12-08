/* --- Day 06: Guard Gallivant --- */

const orientation = {
  '^': { dx:  0, dy: -1 },
  '>': { dx:  1, dy:  0 },
  'v': { dx:  0, dy:  1 },
  '<': { dx: -1, dy:  0 },
};

const vectorChar = vector => ({
  '(-1,0)': '^',
  '(0,1)': '>',
  '(1,0)': 'v',
  '(0,-1)': '<',
})[vector];

function drawMap(map) {
  const digitsRequired = Math.ceil(Math.log(map[0].length)/Math.log(10));
  for (let i = 0; i < digitsRequired; i += 1) {
    console.log(
      Array(digitsRequired).fill(' ').join(''),
      [...Array(map.length).keys()].map(n => String(n).padStart(digitsRequired, '0')[i]).join('')
    );
  }
  map.forEach((l, i) => console.log(`${ String(i).padStart(digitsRequired, '0') } ${ l }`));
};

function findGuard(map) {
  const y = map.findIndex(r => r.includes('^')) // row
  const x = map[y].indexOf('^'); // col
  return { x, y, ...orientation['^'] };
};

const blockades = [];
const newBlockades = [];

function rotateGuard(g) {
  const clone = { ...g };
  const temp = clone.dx;
  clone.dx = -clone.dy;
  clone.dy = temp;
  return { ...clone };
};

function walkGuard(map, guard, lookForNewBlockadeOpportunities = false) {
  let looping = false;
  const visited = {};

  let next = {
    x: guard.x + guard.dx,
    y: guard.y + guard.dy,
  };

  visited[`(${ guard.y },${ guard.x })`] = [`(${ guard.dy },${ guard.dx })`];

  while (map?.[next.y]?.[next.x] && !looping) {
    if (map?.[next.y]?.[next.x] === '#') {
      blockades.push(next);
      guard = { ...rotateGuard(guard) };
    } else {
      // if (lookForNewBlockadeOpportunities) {
      //   // we're stepping the guard forward, but before we do, let's determine
      //   // the resulting path if there _was_ a blockade in the next square.

      //   // let's assume there isn't already one there
      //   if (!blockades.find(b => b.x === guard.x + guard.dx && b.y === guard.y + guard.dy)) {
      //     // we only need to consider locations where there is an existing blockade
      //     // in a straight line off to the guard's right-hand side.
      //     let hittableBlockade = null;
      //     switch (`(${guard.dy},${guard.dx})`) {
      //       case '(-1,0)': // heading north, look east
      //         hittableBlockade = blockades
      //           .filter(b => b.y === guard.y && b.x > guard.x)
      //           .sort((a, b) => a.x - b.x)?.[0];
      //           break;
      //       case '(1,0)': // heading south, look west
      //         hittableBlockade = blockades
      //           .filter(b => b.y === guard.y && b.x < guard.x)
      //           .sort((a, b) => b.x - a.x)?.[0];
      //           break;
      //       case '(0,1)': // heading east, look south
      //         hittableBlockade = blockades
      //           .filter(b => b.y > guard.y && b.x === guard.x)
      //           .sort((a, b) => a.y - b.y)?.[0];
      //           break;
      //       case '(0,-1)': // heading west, look north
      //         hittableBlockade = blockades
      //           .filter(b => b.y < guard.y && b.x === guard.x)
      //           .sort((a, b) => b.y - a.y)?.[0];
      //           break;
      //     };
      //     if (hittableBlockade) {
      //       console.log(` + blockade @(${guard.y - 1},${guard.x}) runs guard into blockade @(${hittableBlockade.y},${hittableBlockade.x})`);
      //       newBlockades.push({ x: guard.x + guard.dx, y: guard.y + guard.dy });
      //     }
      //   }
      // }

      // ok done. step the guard.
      guard = { ...guard, ...next };

      // record this visited location
      if (`(${ guard.y },${ guard.x })` in visited) {
        // we're looping if the guard been here before, heading in this direction
        if (visited[`(${ guard.y },${ guard.x })`].includes(`(${ guard.dy },${ guard.dx })`)) {
          // console.log(`(${ guard.y },${ guard.x }):`, visited[`(${ guard.y },${ guard.x })`]);
          // console.log(`been here (${ guard.y },${ guard.x }) going (${ guard.dy },${ guard.dx })`);
          looping = true;
        }
        visited[`(${ guard.y },${ guard.x })`].push(`(${ guard.dy },${ guard.dx })`)
      } else {
        visited[`(${ guard.y },${ guard.x })`] = [`(${ guard.dy },${ guard.dx })`];
      }
    }
    // now, we've turned if we need to. where to step next?
    next = { y: guard.y + guard.dy, x: guard.x + guard.dx };
  };

  return { visited, newBlockades, looping };
};

function showMapThusFar() {}

export const part1 = function(input) {
  const guard = findGuard(input);
  const { visited } = walkGuard(input, guard, true);
  drawMap(input);
  // console.log(visited)

  // const visitsMap = input.map((line, row) => {
  //   return line.split('')
  //     .map((char, col) => {
  //       const vectorCount = visited[`(${row},${col})`]?.length ?? 0;
  //       console.log({ sq: `(${row},${col})`, vectorCount, char, v: vectorChar(visited[`(${row},${col})`]?.[vectorCount - 1]) })
  //       return vectorCount === 0 ? char : vectorChar(visited[`(${row},${col})`]?.[vectorCount - 1])
  //     }).join('')
  // });
  // drawMap(visitsMap);
  return Object.keys(visited).length;
};

export const part2 = function(input) {
  // drawMap(input);
  const guard = findGuard(input);
  const { visited } = walkGuard(input, guard, true);
  const loopingNewBlockades = Object.keys(visited).filter((bs, i) => {
    const pattern = new RegExp(/^\((\d+),(\d+)\)$/);
    const [, row, col] = bs.match(pattern);
    const b = { x: +col, y: +row };
    process.stdout.write(`${ i + 1 } / ${ Object.keys(visited).length }`)
    let newMap = [...input];
    newMap[b.y] = [...newMap[b.y].slice(0, b.x), '#', ...newMap[b.y].slice(b.x + 1)].join('');
    // drawMap(newMap);
    const { looping } = walkGuard(newMap, guard);
    console.log('. . . . . . . . loop?', looping ? '✅' : '❌')
    return looping;
  });

  return loopingNewBlockades.length;
};
