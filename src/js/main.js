/*
  Main entry for entire application's JS.

*/
const { app, BrowserWindow } = require('electron')
const path = require('path')

//custom func to make a new 'default' window.
function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../js/preload.js'),
      contextIsolation: true
    }
  })

  win.loadFile('src/html/index.html')
}

//API call - app has first loaded.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

//API call - exit entire application.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})