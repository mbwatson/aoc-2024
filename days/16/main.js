/*
  --- Day 16: Reindeer Maze ---
*/

function parse(lines) {
  const height = lines.length;
  const width = lines[0].length;
  return lines.reduce((acc, line, y) => {
    for (let x = 0; x < width; x += 1) {
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
  });
};


function walkMaze(maze) {
  const dirs = [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
  ];
  let pointer = maze.S;

  const paths = [];
  const solved = false;

  function step({ x, y }, path) {
    if (solved) return;

    path.push({ x, y });
    let canStep = false;

    for (let d of dirs) {
      const next = { y: y + d.y, x: x + d.x };
      if (maze.map[y][x] === '.') {
        canStep = true;
        step(next.y, next.x, path);
      }
      if (maze.map[y][x] === '#') { canStep = false; }
      if (maze.map[y][x] === 'E') {
        solved = true;
      }
    }

    if (!canStep) { paths.push([...path]); }
    
    path.pop();
  }

  const start = maze.S[0];
  step(start, []);

  return paths;
}
export const part1 = function(input) {
  const maze = parse(input);
  console.log(maze);
  walkMaze(maze);
  return null;
};

export const part2 = function(input) {
  return null;
};
