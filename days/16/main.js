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
  let minPath = null;
  let minCost = Infinity;

  let maxL = 0;
  function step({ x, y }, path = [], visited = new Set()) {
    path.push({ x, y });
    const hsh = hash(x, y);
    visited.add(hsh);
    maxL = Math.max(maxL, path.length);
    console.log(' '.repeat(path.length), path.length, maxL);
    const valid = ({ x, y }) => 
        (0 <= x && x < maze.width) && (0 <= y && y < maze.height) // on map
        && (maze.map[y][x] === '.' || maze.map[y][x] === 'E')     // valid char
        && !visited.has(hash(x, y));                              // unvisited
    // at end?
    if (maze.map[y][x] === 'E') {
      const pathCost = cost(path);
      if (pathCost < minCost) {
        minCost = pathCost;
        minPath = [...path];
      }
    }
    // look around, take steps as able
    for (const dir of dirs) {
      const next = { x: x + dir.x, y: y + dir.y };
      if (valid(next)) { step(next, path, visited); }
    }
    path.pop();
    visited.delete(hsh);
  }
  const start = maze.S?.[0];
  if (!start) throw new Error('maze does not have a start "S".');
  step(start);
  return minPath;
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
