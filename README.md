# Advent of Code 2024

## Quickstart

1. initialize solution files for day `N`.
```bash
npm run init -- --day=<N> --title="Puzzle Title"
```

2. write solution functions&mdash;`part1` and `part2`&mdash;in `days/<N>/main.js`.

3. validate solution on test input.
```bash
npm run solve -- --day <N> --test
```

4. solve on real input.
```bash
npm run solve -- --day <N>
```

## Script Parameters & Flags

### `init`:
  - day number: `--day`, `-d`
  - don't actually write init files to disk: `--pretend`, `-p`
  - puzzle title: `--title`, `-t`
  - log more (debug): `--verbose`, `-v`

### `solve`:
  - day number: `--day`, `-d`
  - solve with test data: `--test`, `-t`

