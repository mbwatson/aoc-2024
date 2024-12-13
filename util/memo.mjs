function serialize(...args) { return JSON.stringify(args); }

export default function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = serialize(...args);
    // we've seen these args before
    if (cache.has(key)) {
      // console.log(`cache hit: "${ key }"`);
      return cache.get(key);
    }
    // console.log(`cache miss: "${ key }"`);
    // new stuff! calculate & cache.
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
