const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

setTimeout(() => {
  console.log("setInterval")
  autoUpdater.checkForUpdates();
  dialog.showMessageBox(null, {
    title: 'autoUpdater',
    message: 'autoUpdater Interval'
  });
}, 60000)

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});


autoUpdater.on('update-available', () => {
  console.log("update-available")
  dialog.showMessageBox(null, {
    title: 'autoUpdater update-available',
    message: 'autoUpdater update-available'
  });
  win.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(null, {
    title: 'autoUpdater update-downloaded',
    message: 'autoUpdater update-downloaded'
  });
  console.log("update-downloaded")
  win.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  console.log("restart_app")
  dialog.showMessageBox(null, {
    title: 'autoUpdater restart_app',
    message: 'autoUpdater restart_app'
  });
  autoUpdater.quitAndInstall();
});

autoUpdater.on('update-not-available', (info) => {
  dialog.showMessageBox(null, {
    title: 'autoUpdater update-not-available',
    message: JSON.stringify(info)
  });
  console.log("update-not-available")
})

autoUpdater.on('error', (err) => {
  dialog.showMessageBox(null, {
    title: 'autoUpdater error',
    message: JSON.stringify(err)
  });
  console.log("error")
})

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
