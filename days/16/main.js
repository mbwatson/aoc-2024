/*
  --- Day 16: Reindeer Maze ---
*/

function hash(i, j) { return `${ i },${ j }`; }

class PriorityQueue {
  constructor() {
    this.items = [];
  }
  enqueue(element, cost) {
    this.items.push({ element, cost });
    this.items.sort((a, b) => a.cost - b.cost);
  }
  dequeue() { return this.items.shift().element; }
  isEmpty() { return this.items.length === 0; }
}

function drawMaze(grid) {
  const digitsRequired = Math.ceil(Math.log(grid[0].length) / Math.log(10));
  for (let i = 0; i < digitsRequired; i++) {
    console.log(
      Array(digitsRequired).fill(' ').join(''),
      [...Array(grid.length).keys()].map(n => String(n).padStart(digitsRequired, '0')[i]).join('')
    );
  }
  grid.forEach((l, i) => console.log(`${ String(i).padStart(digitsRequired, '0') } ${ l }`));
};

const dirs = [{ x:  0, y:  1 }, { x:  1, y:  0 }, { x:  0, y: -1 }, { x: -1, y:  0 }];

function dirChar({ x, y }) {
  if (hash(x, y) === `1,0`) { return `>`; }
    else if (hash(x, y) === `-1,0`) { return `<`; }
    else if (hash(x, y) === `0,1`) { return `v`; }
    else if (hash(x, y) === `0,-1`) { return `^`; }
    else return '?';
}

function findMinPath(grid, start, end) {
  const [height, width] = [grid.length, grid[0].length];

  const costs = Array.from({ length: height }, () => Array(width).fill(Infinity));
  const sources = Array.from({ length: height }, () => Array(width).fill(null));
  const pq = new PriorityQueue();
  
  costs[start.x][start.y] = 0;
  pq.enqueue(start, 0);

  while (!pq.isEmpty()) {
    const current = pq.dequeue();

    if (current.x === end.x && current.y === end.y) {
      const reconstructed = [];
      let { x, y } = end;
      while (!!x && !!y) {
        const source = sources[x][y];
        const dx = (x - sources?.[x]?.[y]?.x) ?? null;
        const dy = (y - sources?.[x]?.[y]?.y) ?? null;
        reconstructed.unshift({ x, y, dx, dy });
        x = source?.x;
        y = source?.y;
      }
      reconstructed.forEach(p => {
        console.log(p, sources[p.x][p.y])
      })
      return {
        cost: costs[end.x][end.y],
        path: reconstructed,
      };
    }

    const source = sources[current?.x][current?.y] ?? { x: null, y: null };

    let lastDir;
    for (let d of dirs) {
      const next = { x: current.x + d.x, y: current.y + d.y, dir: dirChar(d) };
      if (0 <= next.y && next.y < height && 0 <= next.x && next.x < width && grid[next.x][next.y] !== '#') {
        const stepCost = next.dir === source.dir ? 1 : 1000;
        const newCost = costs[current.x][current.y] + stepCost;
        console.log({ current, next, stepCost, newCost })
        if (newCost < costs[next.x][next.y]) {
          costs[next.x][next.y] = newCost;
          sources[next.x][next.y] = current;
          pq.enqueue(next, newCost);
        }
      }
    }
  }

  return [];
}

export const part1 = function(input) {
  const path = findMinPath(input, { x: 1, y: 13 }, { x: 13, y: 1 });
  console.log(path);
  drawMaze(input, path);
  return null;
};

export const part2 = function(input) {
  return null;
};
