#!/usr/bin/env node
/**
 * Cross-platform backend launcher.
 * Uses backend/.venv if it exists, otherwise falls back to system python.
 * macOS: prefers python3; Windows: uses python.
 */
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const backendDir = path.join(root, 'backend');

const isWin = process.platform === 'win32';
const venvBin = path.join(backendDir, '.venv', isWin ? 'Scripts' : 'bin');
const venvPython = path.join(venvBin, 'python' + (isWin ? '.exe' : ''));
const venvPython3 = path.join(venvBin, 'python3' + (isWin ? '.exe' : ''));

let python;
if (fs.existsSync(venvPython)) {
  python = venvPython;
} else if (fs.existsSync(venvPython3)) {
  python = venvPython3;
} else {
  python = isWin ? 'python' : 'python3';
}

const proc = spawn(python, ['-m', 'flask', '--app', 'app', 'run', '--debug'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: false,
});

proc.on('error', (err) => {
  console.error('Failed to start backend:', err.message);
  process.exit(1);
});

proc.on('exit', (code) => {
  process.exit(code ?? 0);
});
