import { app, BrowserWindow, Tray, nativeImage, Menu, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null
let tray: Tray | null = null
let focusSessionActive = false
let sessionElapsedMs = 0

function formatSessionTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function updateTrayTooltip() {
  if (!tray) return
  if (focusSessionActive) {
    tray.setToolTip(`Session: ${formatSessionTime(sessionElapsedMs)}`)
  } else {
    tray.setToolTip('Restore')
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    icon: path.join(process.env.VITE_PUBLIC, 'main_icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.on('closed', () => {
    win = null
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

function showOrCreateWindow() {
  if (win && !win.isDestroyed()) {
    win.show()
    win.focus()
  } else {
    createWindow()
  }
}

function updateTrayContextMenu() {
  if (!tray) return
  const focusItem = focusSessionActive
    ? {
        label: 'End Focus Session',
        click: () => {
          showOrCreateWindow()
          if (win && !win.isDestroyed()) {
            const sendEndFocus = () => win!.webContents.send('tray-end-focus-session')
            if (win.webContents.isLoading()) {
              win.webContents.once('did-finish-load', sendEndFocus)
            } else {
              sendEndFocus()
            }
          }
        },
      }
    : {
        label: 'Start Focus Session',
        click: () => {
          showOrCreateWindow()
          if (win && !win.isDestroyed()) {
            const sendStartFocus = () => win!.webContents.send('tray-start-focus-session')
            if (win.webContents.isLoading()) {
              win.webContents.once('did-finish-load', sendStartFocus)
            } else {
              sendStartFocus()
            }
          }
        },
      }
  const menuItems: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Show Restore',
      click: () => showOrCreateWindow(),
    },
    focusItem,
  ]
  if (focusSessionActive) {
    menuItems.push({
      label: `Session time: ${formatSessionTime(sessionElapsedMs)}`,
      enabled: false,
    })
  }
  menuItems.push({
    label: "I'm overwhelmed",
    click: () => {
      showOrCreateWindow()
      if (win && !win.isDestroyed()) {
        const sendImOverwhelmed = () => win!.webContents.send('tray-im-overwhelmed')
        if (win.webContents.isLoading()) {
          win.webContents.once('did-finish-load', sendImOverwhelmed)
        } else {
          sendImOverwhelmed()
        }
      }
    },
  })
  menuItems.push(
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => app.quit(),
    }
  )
  tray.setContextMenu(Menu.buildFromTemplate(menuItems))
  updateTrayTooltip()
}

function createTrayIcon() {
  if (tray) {
    return
  }
  const iconPath = path.join(process.env.VITE_PUBLIC!, 'corgi_icon.png')
  const image = nativeImage.createFromPath(iconPath)
  // macOS menu bar: 22x22; Windows system tray: 16x16
  const size = process.platform === 'darwin' ? 22 : 16
  const trayImage = image.resize({ width: size, height: size })
  tray = new Tray(trayImage)
  updateTrayContextMenu()
  // Consume click so icon never opens the window (same on macOS and Windows)
  tray.on('click', () => { })
}

// Keep app running when window closes if tray exists; otherwise quit on Windows/Linux.
app.on('window-all-closed', () => {
  if (tray) {
    return
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  } else {
    showOrCreateWindow()
  }
})

// Single instance: second launch focuses existing app
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    showOrCreateWindow()
  })
}

app.whenReady().then(() => {
  createWindow()
  createTrayIcon()
  ipcMain.handle('create-tray', () => {
    createTrayIcon()
  })
  ipcMain.on('tray-set-focus-session-active', (_event, active: boolean) => {
    focusSessionActive = active
    if (tray) {
      updateTrayContextMenu()
      updateTrayTooltip()
    }
  })
  ipcMain.on('tray-set-session-elapsed-ms', (_event, ms: number) => {
    sessionElapsedMs = ms
    if (tray && focusSessionActive) {
      updateTrayContextMenu()
      updateTrayTooltip()
    }
  })
})
