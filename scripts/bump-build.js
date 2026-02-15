import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Read and increment build number
const buildNumberPath = resolve(root, '.build-number');
const buildNumber = parseInt(readFileSync(buildNumberPath, 'utf-8').trim(), 10) + 1;
writeFileSync(buildNumberPath, buildNumber + '\n');

// Read semver from package.json
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));
const semver = pkg.version;
const version = `${semver}+${buildNumber}`;

// Write generated version file
const generatedDir = resolve(root, 'src/generated');
mkdirSync(generatedDir, { recursive: true });
writeFileSync(
  resolve(generatedDir, 'version.ts'),
  `export const VERSION = '${version}';\nexport const SEMVER = '${semver}';\nexport const BUILD_NUMBER = ${buildNumber};\n`
);

console.log(`Build ${version}`);
