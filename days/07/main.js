// --- Day 07: Bridge Repair ---

function parseLine(line) {
  let [result, operands] = line.split(': ');
  return {
    result: Number(result),
    operands: operands.split(' ').map(Number),
  }
};

function couldBeTrue(result, values, operators) {
  function evaluate(i, currentValue) {
    // bail out when all operands have been exhausted
    if (i === values.length) {
      return currentValue === result;
    }
    // +
    if (operators.includes('+') && evaluate(i + 1, currentValue + values[i])) {
      return true;
    }
    // *
    if (operators.includes('*') && evaluate(i + 1, currentValue * values[i])) {
      return true;
    }
    // ||
    if (operators.includes('||') && evaluate(i + 1, Number(`${ currentValue }${ values[i] }`))) {
      return true;
    }
    return false;
  }
  return evaluate(1, values[0]);
}

export const part1 = function(input) {
  return input.reduce((acc, line) => {
    const { result, operands } = parseLine(line);
    if (couldBeTrue(result, operands, ['+', '*'])) {
      acc += result;
    }
    return acc;
  }, 0);
};

export const part2 = function(input) {
  return input.reduce((acc, line) => {
    const { result, operands } = parseLine(line);
    if (couldBeTrue(result, operands, ['+', '*', '||'])) {
      acc += result;
    }
    return acc;
  }, 0);
};
