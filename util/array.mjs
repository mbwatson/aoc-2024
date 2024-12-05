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
