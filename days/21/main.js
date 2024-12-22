/*
  --- Day 21: Keypad Conundrum ---
                                                      +---+---+---+
                                                      | 7 | 8 | 9 |
                                                      +---+---+---+
                                                      | 4 | 5 | 6 |
    +---+---+         +---+---+         +---+---+     +---+---+---+
    | ^ | A |         | ^ | A |         | ^ | A |     | 1 | 2 | 3 |
+---+---+---+     +---+---+---+     +---+---+---+     +---+---+---+
| < | v | > |     | < | v | > |     | < | v | > |         | 0 | A |
+---+---+---+     +---+---+---+     +---+---+---+         +---+---+
      A                 B                 C                 D

           0    1    2    3    4    5    6    7    8    9    A
      0    .    .    ^    .    .    .    .    .    .    .    >
      1    .    .    >    .    ^    .    .    .    .    .    .
      2    v    <    .    >    .    ^    .    .    .    .    .
      3    .    .    >    .    .    .    ^    .    .    .    v
  M = 4    .    v    .    .    .    >    .    ^    .    .    .
      5    .    .    v    .    <    .    >    .    ^    .    .
      6    .    .    .    v    .    <    .    .    .    ^    .
      7    .    .    .    .    v    .    .    .    >    .    .
      8    .    .    .    .    .    v    .    <    .    >    .
      9    .    .    .    .    .    .    v    .    <    .    .
      A    <    .    .    ^    .    .    .    .    .    .    .

           0    1    2    3    4    5    6    7    8    9    A
      0    .    .    ^v   .    .    .    .    .    .    .    ><
      1    >v   ^v   .    >>   .    .    .    .    .    .    .
      2    .    .    v^   .    <^   .    >^,^>.    ^^   .    .
      3    .    <<   .    .    .    .    .    .    .    .    .
M^2 = 4    .    .    .    .    .    .    .    .    .    .    .
      5    .    .    .    .    .    .    .    .    .    .    .
      6    .    .    .    .    .    .    .    .    .    .    .
      7    .    .    .    .    .    .    .    .    .    .    .
      8    .    .    .    .    .    .    .    .    .    .    .
      9    .    .    .    .    .    .    .    .    .    .    .
      A    <>   .    .    .    .    .    .    .    .    .    .

*/

let codes;
const robots = { d: [], a: [], b: [], c:[] };

function concatMult(s, t) {
  if (s === '.' || t === '.') {
    return '';
  }
  let clean = false;
  let product = s + t;
  const ids = ['^v', '<>', '^<v>', '.']
  while (!clean) {
    clean = true;
    ids.forEach(u => {
      if (product.indexOf(u) > -1) {
        product = product.replace(u, '');
        clean = false;
      }
    });
  }
  return product;
}

function concatDotProduct(v1, v2) {
  let product = [];
  for (let i = 0; i < v1.length; i++) {
    product.push(concatMult(v1[i], v2[i]));
  };
  const res = product.reduce((acc, str) => {
    if (str === '') { return acc; }
    acc.push(str);
    return acc;
  }, []);
  return res.join(' + ');
}

function concatMatrixMult(A, B) {
  const rowsA = A.length,
        colsA = A[0].length,
        rowsB = B.length,
        colsB = B[0].length;

  if (colsA !== rowsB) {
    throw new Error('invalid matrix dimensions');
  }

  const result = Array.from({ length: rowsA }, () => 
    Array.from({ length: colsB }, () => [])
  );

  for (let i = 0; i < rowsA; i++) {
    const row = A[i];
    for (let j = 0; j < colsB; j++) {
      const col = B.map(r => r[j]);
      result[i][j] = concatDotProduct(row, col);
    }
  }

  return result;
}

const M = [
/*        0    1    2    3    4    5    6    7    8    9    A */
/* 0 */ ['.', '.', '^', '.', '.', '.', '.', '.', '.', '.', '>'],
/* 1 */ ['.', '.', '>', '.', '^', '.', '.', '.', '.', '.', '.'],
/* 2 */ ['v', '<', '.', '>', '.', '^', '.', '.', '.', '.', '.'],
/* 3 */ ['.', '.', '<', '.', '.', '.', '^', '.', '.', '.', 'v'],
/* 4 */ ['.', 'v', '.', '.', '.', '>', '.', '^', '.', '.', '.'],
/* 5 */ ['.', '.', 'v', '.', '<', '.', '>', '.', '^', '.', '.'],
/* 6 */ ['.', '.', '.', 'v', '.', '<', '.', '.', '.', '^', '.'],
/* 7 */ ['.', '.', '.', '.', 'v', '.', '.', '.', '>', '.', '.'],
/* 8 */ ['.', '.', '.', '.', '.', 'v', '.', '<', '.', '>', '.'],
/* 9 */ ['.', '.', '.', '.', '.', '.', 'v', '.', '<', '.', '.'],
/* A */ ['<', '.', '.', '^', '.', '.', '.', '.', '.', '.', '.'],
];

function display(matrix) {
  const [width, height] = [matrix[0].length, matrix.length]
  console.log({ width, height });
  const digitsRequired = Math.ceil(Math.log(width) / Math.log(10));
  for (let i = 0; i < digitsRequired; i += 1) {
    console.log(
      ' ',
      Array(digitsRequired).fill(' ').join(''),
      [...Array(width).keys()].map(n => n.toString(16).toUpperCase().padStart(digitsRequired, '0 ')[i]).join('   ')
    );
  }
  for (let y = 0; y < height; y += 1) {
    process.stdout.write(`${ y.toString(16).toUpperCase().padStart(digitsRequired, '0') } | `);
    for (let x = 0; x < width; x += 1) {
      process.stdout.write(matrix[y][x] + ' | ');
    }
    console.log();
  }
  console.log();
};

export const part1 = function(input) {
  codes = [...input];
  console.log(codes);
  const code = codes[0];

  for (let ch of code) {
    console.log({ ch });
    robots.d.push(ch)
  }


  console.log('M');
  display(M)

  console.log('M^2');
  display(concatMatrixMult(M, M));

  /*
    code 0 2 9 A:
    move from A to 0  ::  least n such that M^n has an entry in [A, 0]  oO( n=1 )
    press 0
    move from 0 to 2  ::  least n such that M^n has an entry in [0, 2]  oO( n=1 )
    press 2
    move from 2 to 9  ::  least n such that M^n has an entry in [2, 9]  oO( n=2 )
    press 9
    move from 9 to A  ::  least n such that M^n has an entry in [0, 2]  oO( n=3 )
    press A
  */

  return null;
};

export const part2 = function(input) {
  return null;
};
