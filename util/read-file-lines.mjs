import fs from 'fs'

export const readFileLines = (path, delimiter = '\n') => {
  let lines = [];
  try {
    const input = fs.readFileSync(path, 'utf8');
    lines = input.trim().split(delimiter);
  } catch (error) {
    console.log(error);
  }
  return lines;
}