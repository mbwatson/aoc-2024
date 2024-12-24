/*
  --- Day 24: Crossed Wires ---

  part1: 14.855ms
  part2: 
  Solutions: { part1: 56729630917616, part2: null }

*/

function parse(lines) {
  const sep = lines.indexOf('');
  const copy = [...lines];

  const wires = copy.splice(0, sep).reduce((acc, s) => {
    let [gate, value] = s.split(': ');
    acc.set(gate, Number(value));
    return acc;
  }, new Map());

  const connections = copy.slice(1).reduce((acc, s) => {
    const [input, output] = s.split(' -> ');
    const [a, gate, b] = input.split(' ');
    acc[output] = { gate, a, b };
    return acc;
  }, {});

  return {
    wires,
    connections,
  };
}

function Circuit(input) {
  const { wires, connections } = parse(input);

  const op = {
    AND: function and(a, b) { return a & b; },
    OR: function or(a, b) { return a | b; },
    XOR: function xor(a, b) { return a ^ b; },
  };

  function valueOf(wire) {
    if (wires.has(wire)) { return wires.get(wire); }

    if (!(wire in connections)) {
      throw new Error('could not locate wire', wire);
      return;
    }

    const { gate, a, b } = connections[wire];
    return op[gate](valueOf(a), valueOf(b));
  }

  return { valueOf, wires, connections };
}

export const part1 = function(input) {
  const { valueOf, connections } = new Circuit(input);

  const bitstring = Object.keys(connections)
    .filter(wire => wire.startsWith('z'))
    .sort()
    .reduce((acc, wire) => `${ valueOf(wire) }${ acc }`, '');

  return parseInt(bitstring, 2);
};

export const part2 = function(input) {
  const { valueOf, wires, connections } = new Circuit(input);
  const { x, y } = [...wires.entries()]
    .reduce(({ x, y }, [wire, value]) => {
      console.log(wire, value);
      if (wire.startsWith('x')) { x = `${ value }${ x }`; }
      else if (wire.startsWith('y')) { y = `${ value }${ y }`; }
      return { x, y };
    }, { x: '', y: '' });
  const result = Object.keys(connections)
    .filter(wire => wire.startsWith('z'))
    .sort()
    .reduce((acc, wire) => `${ valueOf(wire) }${ acc }`, '')
  console.log({
    x_bin: x,
    y_bin: y,
    correct_bin: (parseInt(x, 2) + parseInt(y, 2)).toString(2),
    actual_bin: result,
    x: parseInt(x, 2),
    y: parseInt(y, 2),
    correct: parseInt(x, 2) + parseInt(y, 2),
    actual: parseInt(result, 2),
  });

  return null;
};
