import { execSync } from 'node:child_process';

export default function execute(command = "") {
  execSync(command, (error, stdout, stderr) => {
    if (error) {
      console.error('error:', error);
      return;
    }
    if (stderr) {
      console.error('stderr:', stderr);
      return;
    }
    console.log(stdout);
  });
}
