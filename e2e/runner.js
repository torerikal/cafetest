import * as child_process from "child_process";
import crossSpawn from 'cross-spawn';

const spawn = command => {
  const [c, ...args] = command.split(' ');
  return crossSpawn(c, args);
};

const serve = () => {
  const served = spawn('yarn serve');
  served.stdout.on('data', data => console.log('' + data));
  served.stderr.on('data', data => console.error('' + data));
  served.on('close', code => console.info('' + code));
  return served;
};

const build = () => {
  const result = child_process.execSync(`yarn build`);
  console.info('' + result);
};

const run = served => {
  const e2e = spawn(`yarn testcafe ${process.env.BROWSER} e2e/**/*.spec.{js,ts} --hostname localhost`);
  e2e.stdout.on('data', (data) => console.log('' + data));
  e2e.stderr.on('data', (data) => console.error('' + data));
  e2e.on('close', (code) => {
      served.kill();
      process.exit(code);
  });
};

build();
const served = serve();
run(served);
