/*
  --- Day 19: Linen Layout ---

  part1: 244.739ms
  part2: 258.519ms
  Solutions: { part1: 363, part2: 642535800868438 }

*/

// this feels like almost like backward autocomplete,
// with chunks of characters instead of single ones,
// so a trie seems appropriate.

class TrieNode {
  constructor() {
    this.children = {};
    this.leaf = false;
  }
}

function buildTrie(words) {
  const root = new TrieNode();

  for (let word of words) {
    let node = root;
    if (!node.children[word]) {
      node.children[word] = new TrieNode();
    }
    node = node.children[word];
    node.leaf = true;
  }
  return root;
}

function countBuilds(target, words) {
  // console.log({ target });
  const trie = buildTrie(words);
  const memo = new Map();

  function backtrack(index) {
    // console.log('-', index)
    if (index === target.length) return 1;
    if (memo.has(index)) { return memo.get(index); }

    let count = 0;
    const node = trie;
    for (let i = index; i < target.length; i += 1) {
      const chunk = target.slice(index, i + 1);
      // console.log({chunk})
      if (node.children[chunk]) {
        count += backtrack(i + 1);
      }
    }

    memo.set(index, count);
    return count;
  }

  return backtrack(0);
}

export const part1 = function(input) {
  const [availableList, _, ...designs] = input;
  const available = availableList.split(', ');

  return designs.reduce((count, design) => {
    if (countBuilds(design, available)) { count += 1; }
    return count;
  }, 0);
};

export const part2 = function(input) {
  const [availableCsv, _, ...designs] = input;
  const available = availableCsv.split(', ');

  return designs.reduce((count, design) => {
    return count + countBuilds(design, available);
  }, 0);
};
