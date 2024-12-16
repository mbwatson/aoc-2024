/*
  --- Day 16: Reindeer Maze ---
*/

function hash(i, j) { return `${ i },${ j }`; }
function unhash(str) { return str.split(',').map(Number); }

function parse(lines) {
  const height = lines.length;
  const width = lines[0].length;
  const hashes = [];
  return lines.reduce((acc, line, y) => {
    for (let x = 0; x < width; x += 1) {
      hashes.push(hash(x, y));
      if (line[x] in acc) {
        acc[line[x]].push({ x, y });
      } else {
        acc[line[x]] = [{ x, y }];
      }
    }
    return acc;
  }, {
    '#': [],
    width,
    height,
    map: lines,
    hashes,
  });
};

function walkMaze(maze) {
  const dirs = [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
  ];
  const paths = [];

  function step({ x, y }, path = []) {
    path.push(hash(x, y));

    function validStep({ x, y }) {
      return (maze.map[y][x] === '.' || maze.map[y][x] === 'E') 
        && !path.includes(hash(x, y))
    }

    if (maze.map[y][x] === 'E') {
      paths.push([...path]);
      return;
    }

    for (let d of dirs) {
      const next = { x: x + d.x, y: y + d.y };
      if (validStep(next)) {
        step(next, path);
      } else if (maze.map[y][x] === '#') {
        paths.push([...path]);
        path.pop();
      }
    }
  }

  const start = maze.S[0];
  step(start);

  return paths[0];
}

export const part1 = function(input) {
  const maze = parse(input);
  const path = walkMaze(maze);
  let turnCount = 0;
  let lastDir = null;
  console.log(path);
  console.log(new Set([...path]));
  for (let i = 0; i < path.length - 2; i += 1) {
    const [x, y] = unhash(path[i]);
    const thisDir = hash(x - unhash(path[i-1])[0], y - unhash(path[i-1])[1]);
    console.log(path[i], {thisDir, lastDir})
    if (lastDir && thisDir !== lastDir) {
      turnCount += 1;
    }
    lastDir = hash(x, y);
  }
  console.log({ l: path.length, turnCount })
  return path.length + 1000 * turnCount;
};

export const part2 = function(input) {
  return null;
};
