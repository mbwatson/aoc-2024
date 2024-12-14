/*
  --- Day 14: Restroom Redoubt ---
*/

const room = {
  // width: 11, height: 7, // use with test input
  width: 101, height: 103,
};
room.center = { x: (room.width - 1) / 2, y: (room.height - 1) / 2 };

function parse(lines) {
  return lines.map(line => {
    const pattern = new RegExp(/^p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)$/);
    const [, x, y, dx, dy] = line.match(pattern);
    return { x: +x, y: +y, dx: +dx, dy: +dy };
  })
};

function tick(robots, ticks = 1) {
  const step = ({ x, y, dx, dy }) => ({
    x: (x + dx + room.width) % room.width,
    y: (y + dy + room.height) % room.height,
    dx, dy,
  });
  let result = [...robots];
  for (let t = 0; t < ticks; t += 1) {
    result = [...result].map(step);
  }
  return result;
};

function robotQuadrants(robots) {
  return robots.reduce((acc, { x, y }) => {
    if (x === room.center.x || y === room.center.y) { return acc; }
    if (x < room.center.x) {
      if (y < room.center.y) { acc.xy.push({ x, y }); }
        else { acc.xY.push({ x, y }); }
      return acc;
    };
    if (y < room.center.y) { acc.Xy.push({ x, y }); }
      else { acc.XY.push({ x, y }); }
    return acc;
  }, { xy: [], xY: [], Xy: [], XY: [] });
};

function safetyFactor(robots) {
  const { xy, xY, Xy, XY } = robotQuadrants(robots);
  return xy.length * xY.length * Xy.length * XY.length;
};

function drawRoom(robots) {
  let map = [];
  for (let y = 0; y < room.height; y += 1) {
    map[y] = Array(room.width).fill(0);
    for (let x = 0; x < room.width; x += 1) {
      if (robots.findIndex(r => r.y === y && r.x === x) > -1) {
        map[y][x] += 1;
      }
    }
    console.log(map[y].join(''));
  }
};

export const part1 = function(input) {
  let robots = parse(input);   
  robots = tick(robots, 100);
  return safetyFactor(robots);
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

export const part2 = async function(input) {
  let robots = parse(input);
  // although a modular arithmetic approach felt within reach,
  // looped drawing & visual inspection worked fairly quickly.
  const [start, end] = [6880, 6888];
  robots = tick(robots, start);
  for (let i = start; i <= end; i += 1) {
    console.clear();
    console.log({ i });
    drawRoom(robots);
    await delay(1);
    robots = tick(robots, 1);
  }
  return 6888;
};
