/*
  --- Day 12: Garden Groups ---
*/

function hash(i, j) { return `${ i },${ j }`; }
function unhash(str) { return str.split(',').map(Number); }



function scout(map) {
  const rows = map.length;
  const cols = map[0].length;
  const plots = {};
  const regions = {};

  // initialize all plots as unvisited
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      plots[hash(r, c)] = false;
    }
  }

  // find regions using flood-fill
  let unmappedPlotHash = Object.keys(plots).find(p => !plots[p]);
  while (unmappedPlotHash) {
    const region = floodFill(map, unhash(unmappedPlotHash), plots);
    regions[unmappedPlotHash] = region;
    unmappedPlotHash = Object.keys(plots).find(p => !plots[p]);
  }

  return regions;
}
function floodFill(map, start = [0, 0], plots) {
  const rows = map.length;
  const cols = map[0].length;
  const plant = map[start[0]][start[1]];
  const region = { plant, plots: [], perimeter: 0 };
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];

  function onMap(y, x) {
    return 0 <= y && y < rows && 0 <= x && x < cols;
  }

  function step(y, x) {
    const plotHash = hash(y, x);

    // mark the current plot as visited
    if (plots[plotHash]) return;
    plots[plotHash] = true;

    // add the current plot to the region
    region.plots.push(plotHash);

    // explore neighbors
    for (let [dy, dx] of dirs) {
      const nextY = y + dy;
      const nextX = x + dx;
      if (onMap(nextY, nextX)) {
        if (map[nextY][nextX] === plant) {
          step(nextY, nextX);
        } else {
          region.perimeter += 1;
        }
      } else {
        region.perimeter += 1;
      }
    }
  }

  // start flood-filling
  step(...start);
  return region;
}

export const part1 = function(input) {
  const regions = scout(input, [0, 0]);
  console.log(Object.entries(regions));
  return Object.entries(regions)
    .reduce((price, [plotHash, { plant, plots, perimeter }]) => {
      console.log({ price, plotHash, area: plots.length, perimeter })
      return price + plots.length * perimeter;
    }, 0);
};

export const part2 = function(input) {
  return null;
};

