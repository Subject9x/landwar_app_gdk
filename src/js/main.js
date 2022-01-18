/*
  Main entry for entire application's JS.

*/
const { app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path');
const fs = require('fs');


if (require('electron-squirrel-startup')) return app.quit();

let mainWindow;

//custom func to make a new 'default' window.
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, '../js/preload.js'),
      contextIsolation: true
    }
  })
  //,
  //devTools: false
  //
  //win.removeMenu();
  mainWindow.loadFile('src/html/index.html')
}

//API call - app has first loaded.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  });

  //API call - exit entire application.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });

})

ipcMain.on('ub-dialog-save', (event, ...args)=>{
  console.log('IPCMAIN-data: ' + JSON.stringify(args[1]));
  console.log('IPCMAIN-config: ' + JSON.stringify(args[2]));
  args[2].defaultPath = path.join(__dirname,'../');
  dialog.showSaveDialog(mainWindow, args[2]).then( file =>{
    console.log(file);
    if(!file.canceled){
      fs.writeFile( file.filePath.toString(), JSON.stringify(args[1]), {
          encoding: "utf8",
          flag: "w"
      }, (err)=>{
        console.log(err);
        event.returnValue = err;
      });
    }
    event.returnValue = file.filePath.toString();
  })
});

ipcMain.on('quit-app', ()=> app.quit());