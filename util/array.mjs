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

