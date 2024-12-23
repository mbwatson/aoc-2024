/*
  --- Day 23: LAN Party ---
*/

function hash(i, j) { return `${ i },${ j }`; }
function unhash(str) { return str.split(',').map(Number); }

class AdjacencyMatrix {
  constructor() {
    this.matrix = new Map();
  }

  // Add a node
  addNode(key) {
    if (!this.matrix.has(key)) {
      this.matrix.set(key, new Map());
    }
  }

  // Add an edge with a weight (default weight is 1)
  addEdge(from, to, weight = 1) {
    this.addNode(from);
    this.addNode(to);
    this.matrix.get(from).set(to, weight);
    this.matrix.get(to).set(from, weight); // Add reverse edge
  }
  // Get the weight of an edge
  getEdge(from, to) {
    return this.matrix?.get(from)?.get(to) ?? 0; // Returns 0 if no edge exists
  }

  // Remove an edge
  removeEdge(from, to) {
    this.matrix.get(from)?.delete(to);
    this.matrix.get(to)?.delete(from); // Remove reverse edge
  }

  // Check if a node exists
  hasNode(key) {
    return this.matrix.has(key);
  }

  // Check if an edge exists
  hasEdge(from, to) {
    return (this.matrix.get(from)?.has(to) || this.matrix.get(to)?.has(from)) ?? false;
  }

  // Get all nodes
  getNodes() {
    return Array.from(this.matrix.keys());
  }

  // Get all neighbors of a node
  getNeighbors(key) {
    return this.matrix.get(key) ? Array.from(this.matrix.get(key).keys()) : [];
  }

  getCycles() {
    const nodes = this.getNodes();
    nodes.forEach(node => {
      const nbrs = this.getNeighbors(node);

    });
    return [];
  }
}

export const part1 = function(input) {
  const g = new AdjacencyMatrix();

  input.forEach(line => {
    const [a, b] = line.split('-').sort();
    g.addEdge(a, b);
  });
  console.log(g);

  for (let node of g.getNodes().filter(n => n.includes('t'))) {
    console.log(node, g.getNeighbors(node));
  }

  return null;
};

export const part2 = function(input) {
  return null;
};
