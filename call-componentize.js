import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { componentize } from '@bytecodealliance/componentize-js';
import { execSync } from 'child_process';
import { delimiter } from 'path';
import { env, platform } from 'process';

const jsSource = await readFile('src/index.js', 'utf8');

let wizerBin;
try {
  const isWin = platform === 'win32';
  const cmd = isWin ? 'where wizer' : 'which wizer';
  // Filter out node_modules/.bin from PATH
  const filteredPath = env.PATH.split(delimiter)
    .filter(p => !p.includes('node_modules/.bin'))
    .join(delimiter);
  wizerBin = execSync(cmd, {
    encoding: 'utf-8',
    env: { ...env, PATH: filteredPath }
  }).split('\n')[0].trim();
  console.debug("Using wizer", wizerBin);
} catch {
  console.debug("Using bundled wizer");
}


const { component } = await componentize(jsSource, {
  debugBindings: false,
  witPath: resolve('wit'),
  enableAot: false,
  disableFeatures: [],
  enableWizerLogging: true,
  //wizerBin,
});
await mkdir('dist', { recursive: true });
await writeFile(`dist/fetch-server.wasm`, component);
