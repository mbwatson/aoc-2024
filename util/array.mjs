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

Array.prototype.dotProduct = function (otherArray) {
  if (!Array.isArray(otherArray)) {
    throw new TypeError('Argument must be an array');
  }
  if (this.length !== otherArray.length) {
    throw new Error('Arrays must have the same length');
  }
  return this.reduce((sum, val, i) => sum + val * otherArray[i], 0);
};

Array.prototype.swap = function(index1, index2) {
  if (index1 < 0 || index2 < 0 || index1 >= this.length || index2 >= this.length) {
    throw new Error("Invalid indices");
  }
  [this[index1], this[index2]] = [this[index2], this[index1]];
};

Array.prototype.upTo = function(n) {
  if (!parseInt(n) || n < 0) {
    throw new TypeError('Argument must be a non-negative integer');
  }
  return [...Array(n).keys()];
};
