// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

function judgementElectronIsDev() {
  const electron = require('electron');

  const app = electron.app || electron.remote.app;

  const isEnvSet = 'ELECTRON_IS_DEV' in process.env;
  const getFromEnv = parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;

  return isEnvSet ? getFromEnv : !app.isPackaged;
}

const isDev = judgementElectronIsDev()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

function createWindow() {

  // 自定义菜单
  // require('./electron/menu')

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'electron', 'preload.js')
    },
    icon: __dirname + '/../build/favicon.ico'
  })

  // and load the index.html of the app.
  // mainWindow.loadFile('src/index.html')
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  mainWindow.loadURL(startUrl);


  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // React 开发者工具
  if (isDev) {

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    const {default: installExtension, REACT_DEVELOPER_TOOLS} = require('electron-devtools-installer')

    installExtension(REACT_DEVELOPER_TOOLS).then(name => {
      console.log('Added extension', name)
    }).catch(e => {
      console.log(e)
    })

  }


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

