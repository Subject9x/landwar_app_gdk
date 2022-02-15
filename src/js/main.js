/*
  Main entry for entire application's JS.

*/
const { app, BrowserWindow, ipcMain, dialog} = require('electron');
const path = require('path');
const fs = require('fs');
const csvStringy = require('csv-stringify').stringify;
const csv = require('csv-parser');


if (require('electron-squirrel-startup')) return app.quit();

let mainWindow;
let rulesWindow;

function isAppWindowOpen(windowObj){
  if(windowObj.isDestroyed()){
    return false;
  }
  return true;
}

//custom func to make a new 'default' window.
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 1024,
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

ipcMain.on('quit-app', ()=> app.quit());
/*
  IPCMAIN SIGNALS

*/
ipcMain.handle('ub-dialog-save-csv', async (event, dialogConfig, filedata)=>{
  dialogConfig.defaultPath = path.join(__dirname,'../../');
  dialog.showSaveDialog(mainWindow, dialogConfig).then( file =>{
    console.log(file); 
    if(!file.canceled){
      csvStringy(
          filedata, 
          {
            header: true
          }, 
          (err, output) => {
            if(err){
              console.log(err.stack);
              return;
            }
            fs.writeFile(file.filePath.toString(), output, 'utf-8', (err)=>{
              if(err){
                console.log(err.stack);
              }
            });
          }
      );
    }
  });
});

ipcMain.handle('ub-dialog-load-async', async (event, dialogConfig)=>{
  dialogConfig.defaultPath = path.join(__dirname,'../../');
  let importData = [];
  dialog.showOpenDialog(mainWindow, dialogConfig).then( (file) =>{
    if(!file.canceled && file.filePaths.length > 0){
      fs
      .createReadStream(file.filePaths[0].toString())
      .pipe(csv({separator : ','}))
      .on('data', (data) => {
          try {
            importData.push(data);
          }
          catch(err) {
            console.log(err.stack);
          }
      })
      .on('end',()=>{
        mainWindow.webContents.send('ub-dialog-load-response', JSON.stringify(importData));
      });
    }
  });
});




ipcMain.handle('rb-open-rules-core', (event)=>{
  if(rulesWindow != null){
    if(isAppWindowOpen(rulesWindow)){
      rulesWindow.close();
    }
  }

  rulesWindow = new BrowserWindow({
    width: 800,
    height: 1280,
    webPreferences: {
      contextIsolation: true
    }
  });
  rulesWindow.loadFile('src/html/layout/pages/rulebooks/rulebook_core.html');
  rulesWindow.focus();
});