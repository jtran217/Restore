#!/usr/bin/env node
/**
 * Kill any process using BACKEND_PORT (stale backend).
 * Run before start:all to ensure start:backend wins and uses backend/app.db.
 * Cross-platform: Windows (PowerShell), macOS/Linux (lsof).
 */
import { spawnSync } from 'child_process';
import { platform } from 'os';

const PORT = 39762;
const isWin = platform() === 'win32';

function killPort() {
  if (isWin) {
    const result = spawnSync(
      'powershell',
      [
        '-NoProfile',
        '-Command',
        `$c = Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty OwningProcess; if ($c) { Stop-Process -Id $c -Force; Write-Host "Killed PID $c on port ${PORT}" } else { Write-Host "No process on port ${PORT}" }`,
      ],
      { stdio: 'inherit', encoding: 'utf8' }
    );
    return result.status;
  } else {
    const out = spawnSync('lsof', ['-ti', `:${PORT}`], { encoding: 'utf8' });
    const pids = out.stdout?.trim();
    if (pids) {
      const result = spawnSync('kill', ['-9', ...pids.split(/\s+/)], { stdio: 'inherit' });
      console.log(`Killed PID(s) ${pids} on port ${PORT}`);
      return result.status;
    }
    console.log(`No process on port ${PORT}`);
    return 0;
  }
}

const code = killPort();
process.exit(code ?? 0);
