/*
  --- Day 23: LAN Party ---

  part1: 44.051ms
  part2: 612.934ms
  Solutions: { part1: 1064, part2: 'aq,cc,ea,gc,jo,od,pa,rg,rv,ub,ul,vr,yy' }

*/

function findThreeCycles(edges) {
  // build adjacency map
  const adj = new Map();
  for (const [u, v] of edges) {
    if (!adj.has(u)) adj.set(u, new Set());
    if (!adj.has(v)) adj.set(v, new Set());
    adj.get(u).add(v);
    adj.get(v).add(u);
  }

  const cycles = new Set();

  // iterate through edges
  for (const [u, v] of edges) {
    if (!adj.has(u) || !adj.has(v)) continue;

    // find common neighbors of u and v
    for (const neighbor of adj.get(u)) {
      if (neighbor !== v && adj.get(v).has(neighbor)) {
        // ensure uniqueness via sorting
        const cycle = [u, v, neighbor].sort();
        cycles.add(cycle.join(','));
      }
    }
  }

  return [...cycles].map(s => s.split(','));
}

function findMaxClique(edges) {
  // build adjacency map. copied from other func. todo: refactor to do this only once
  const adj = new Map();
  for (const [u, v] of edges) {
    if (!adj.has(u)) adj.set(u, new Set());
    if (!adj.has(v)) adj.set(v, new Set());
    adj.get(u).add(v);
    adj.get(v).add(u);
  }

  const nodes = [...adj.keys()];
  let maxClique = [];

  function backtrack(current, start) {
    // found a longer one
    if (current.length > maxClique.length) {
      maxClique = [...current];
    }
    for (let i = start; i < nodes.length; i++) {
      const node = nodes[i];
      if (current.every(nbr => adj.get(nbr).has(node))) {
        current.push(node);
        backtrack(current, i + 1);
        current.pop();
      }
    }
  }

  backtrack([], 0);
  return maxClique;
}

export const part1 = function(input) {
  const edges = input.map(line => line.split('-'));

  const threeCycles = findThreeCycles(edges)
    .filter(([a, b, c]) => {
      return a.startsWith('t') || b.startsWith('t') || c.startsWith('t');
    }).map(a => a.join('--'));

  return threeCycles.length;
};

export const part2 = function(input) {
  const edges = input.map(line => line.split('-'));
  const c = findMaxClique(edges);
  return c.sort().join(',');
};
