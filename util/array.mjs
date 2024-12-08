Array.prototype.count = function countOccurrences(x) {
  return this.reduce((acc, y) => {
    if (y in acc) {
      acc[y] += 1;
      return acc;
    }
    acc[y] = 1;
    return acc;
  }, {})[x] ?? 0;
};

Array.prototype.split = function split(index) {
  const clone = [...this];
  return [clone.splice(0, index), clone];
};

Array.prototype.allPairs = function allPairs() {
  const pairs = [];
  for (let i = 0; i < this.length; i++) {
    for (let j = i + 1; j < this.length; j++) {
      pairs.push([this[i], this[j]]);
    }
  }
  return pairs;
}

Array.prototype.unique = function uniqueValues() {
  return [...new Set([...this])];
};
