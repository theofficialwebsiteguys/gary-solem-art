#!/usr/bin/env node
/**
 * Builds the site and publishes it to the repository's gh-pages branch.
 *
 *   npm run deploy:gh-pages                                    # https://<owner>.github.io/gary-solem-art/
 *   npm run deploy:gh-pages -- --base-href / --cname garysolemart.com   # once the custom domain is set up
 *
 * The gh-pages branch holds only build output and is replaced on every deploy (force push).
 * Source code lives on the main branch; nothing there is touched.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist', 'gary-solem-art', 'browser');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
}

const baseHref = arg('base-href', '/gary-solem-art/');
const cname = arg('cname', null);
const branch = arg('branch', 'gh-pages');
const remote = arg('remote', null) ?? git(['remote', 'get-url', 'origin'], ROOT).trim();

// No shell: arguments with spaces (such as the commit message) stay intact on every platform.
function run(cmd, args, cwd = ROOT) {
  console.log(`> ${path.basename(cmd)} ${args.join(' ')}`);
  execFileSync(cmd, args, { cwd, stdio: 'inherit' });
}

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' });
}

// 1. Production build for the target URL.
run(process.execPath, [path.join(ROOT, 'node_modules', '@angular', 'cli', 'bin', 'ng.js'), 'build', '--base-href', baseHref]);

// 2. GitHub Pages extras:
//    404.html — GitHub serves it for unknown paths, so direct visits to /my-art etc. load the app.
//    .nojekyll — serve files as-is (no Jekyll processing).
//    CNAME — only when a custom domain is given.
fs.copyFileSync(path.join(DIST, 'index.html'), path.join(DIST, '404.html'));
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');
if (cname) fs.writeFileSync(path.join(DIST, 'CNAME'), `${cname}\n`);

// 3. Publish the build folder as a single commit on the deploy branch.
const sha = git(['rev-parse', '--short', 'HEAD'], ROOT).trim();
fs.rmSync(path.join(DIST, '.git'), { recursive: true, force: true });
run('git', ['init', '--quiet', '-b', branch], DIST);
run('git', ['add', '--all'], DIST);
run('git', ['commit', '--quiet', '-m', `Deploy ${sha} to GitHub Pages`], DIST);
run('git', ['push', '--force', remote, `${branch}:${branch}`], DIST);
fs.rmSync(path.join(DIST, '.git'), { recursive: true, force: true });

console.log(`\nPublished ${sha} to ${branch} (base href ${baseHref}).`);
