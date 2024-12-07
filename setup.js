import fs from 'node:fs';
import path from 'path';
import templates from './templates.js';

export const TEST_INPUT_FILENAME = `input.test.txt`;
export const REAL_INPUT_FILENAME = `input.txt`;

export const setupWorkspace = function(dirName, title, write, verbose) {
  const dirPath = path.join('days', dirName);
  const writeFile = (filename, content) => fs.writeFileSync(path.join(dirPath, filename), content);
  const horizontalRule = length => [...Array(length).keys()].fill('─').join('');
  const contentPreview = (path, content, verbose) => {
    if (verbose) {
      const line = horizontalRule(path.length + 2);
      console.log(` ╭${ line }╮`);
      console.log(` │ ${ path } │`);
      console.log(` ├${ line }╯`);
      console.log(
        ` │ ` + content.trim().split(`\n`).join(`\n │ `) + `\n` +
        ` ╰${ line }`
      );
      return;
    }
    console.log(` - ${ path }`);
  }

  console.log(`target dir: ./${ dirPath }`);
  write && fs.mkdirSync(dirPath);

  const mainJs = templates.mainJs
    .replace(/{{TITLE}}/g, `--- Day ${ dirName }: ${ title } ---`);

  contentPreview(`${ dirPath }/main.js`, mainJs, verbose);
  contentPreview(`${ dirPath }/test-input.txt`, templates.testInput, verbose);
  contentPreview(`${ dirPath }/real-input.txt`, templates.realInput, verbose);

  // if pretending (write=false), log details and bail out.
  if (!write) {
    console.log('\n ** nothing written to disk -- WRITE_MODE=false (-p) **\n')
    return;
  }

  // write init files to disk
  writeFile('main.js', mainJs);
  writeFile(TEST_INPUT_FILENAME, templates.testInput);
  writeFile(REAL_INPUT_FILENAME, templates.realInput);
  console.log('\n * 1 dir, 3 files written to disk *');
}
