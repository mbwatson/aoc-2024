# Advent of Code 2024

## Quickstart

1. initialize solution files for day `N`.
```bash
npm run init -- --day=<N> --title="Lorem ipsum"
# or
npm run init -- -d <N> -t "Lorem ipsum"
```

2. write solution functions&mdash;`part1` and `part2`&mdash;in `days/<N>/main.js`.

3. execute solutions.
```bash
npm run solve -- --day=<N>
# or
npm run solve -- -d <N>
```

## Script Parameters

### `init`:
  - day number: `--day`, `-d`
  - don't actually write init files to disk: `--pretend`, `-p`
  - puzzle title: `--title`, `-t`
  - log more (debug): `--verbose`, `-v`

### `solve`:
  - day number: `--day`, `-d`
  - solve with test data: `--test`, `-t`

