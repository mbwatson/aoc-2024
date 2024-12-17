/*
  --- Day 16: Reindeer Maze ---
*/

function hash(i, j) { return `${ i },${ j }`; }
function unhash(str) { return str.split(',').map(Number); }

function parse(lines) {
  const height = lines.length,
        width = lines[0].length;
  return lines.reduce((acc, line, y) => {
    for (let x = 0; x < width; x += 1) {
      if (line[x] in acc) {
        acc[line[x]].push({ x, y });
      } else {
        acc[line[x]] = [{ x, y }];
      }
    }
    return acc;
  }, { width, height, map: lines });
};

const dirs = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];

function cost(path) {
  // probably could calculate this along the walk
  let turnCount = 0;
  let lastDir = null;
  for (let i = 1; i < path.length - 1; i += 1) {
    const { x, y } = path[i];
    const { x: prevX, y: prevY } = path[i - 1];
    const thisDir = hash(x - prevX, y - prevY);
    if (thisDir !== lastDir) { turnCount += 1; }
    lastDir = thisDir;
  }
  return path.length - 1 + 1000 * turnCount;
}

function findMinPath(maze) {
  const start = maze.S?.[0];
  if (!start) throw new Error('maze does not have a start "S".');
  
  const dirs = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];
  const { width, height, map } = maze;

  const queue = [{ ...start, cost: 0, turns: 0 }];
  const visited = Array.from({ length: height }, () => Array(width).fill(false));

  function taxicab(x, y) {
    const end = maze.E[0];
    return Math.abs(end.x - x) + Math.abs(end.y - y);
  }

  function isValid({ x, y }) {
    return (
      0 <= x && x < width && 0 <= y && y < height
      && (map[y][x] === '.' || map[y][x] === 'E')
      && !visited[y][x]
    );
  }

  let minCost = Infinity;

  while (queue.length) {
    queue.sort((a, b) => (a.cost + taxicab(a.x, a.y)) - (b.cost + taxicab(b.x, b.y)));
    const { x, y, cost, dir, path = [] } = queue.shift();

    const lastDir = path.length > 1 ? path[path.length - 2].dir : false;
    const turning = lastDir && dir.x === lastDir.x && dir.y === lastDir.y;

    if (map[y][x] === 'E') {
      minCost = Math.min(minCost, turning ? cost + 1000 : cost);
      continue;
    }

    visited[y][x] = true;

    for (const d of dirs) {
      const next = { x: x + d.x, y: y + d.y };
      if (isValid(next)) {
        queue.push({
          ...next,
          cost: cost + 1 + 1000 * turning,
          dir: d,
          turn: turning,
          path: [...path, next],
        });
      }
    }
  }

  return minCost;
}

export const part1 = function(input) {
  const maze = parse(input);
  const path = findMinPath(maze);
  console.log(path);
  return cost(path);
};

export const part2 = function(input) {
  return null;
};
