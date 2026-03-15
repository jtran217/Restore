#!/usr/bin/env node
/**
 * Cross-platform backend launcher.
 * Uses backend/.venv if it exists, otherwise falls back to system python.
 */
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const backendDir = path.join(root, 'backend');

const isWin = process.platform === 'win32';
const venvPython = path.join(backendDir, '.venv', isWin ? 'Scripts' : 'bin', 'python' + (isWin ? '.exe' : ''));

const python = fs.existsSync(venvPython) ? venvPython : 'python';

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
