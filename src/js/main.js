/*
  Main entry for entire application's JS.

*/
const { app, BrowserWindow, ipcMain, dialog, MessageChannelMain} = require('electron');
const path = require('path');
const fs = require('fs');
const csvStringy = require('csv-stringify').stringify;
const csv = require('csv-parser');
const console = require('console');

if (require('electron-squirrel-startup')) return app.quit();

let mainWindow;
let rulesWindow;
let rulesInfoWindow;
let tagCoreWindow;

const windows = new Set();
const windowsUBSheets = new Set();

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
  mainWindow.loadFile('src/html/index.html');
  mainWindow.on('close', (event) => {
    app.quit();
  });
  windows.add(mainWindow);
}

//API call - app has first loaded.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  //API call - exit entire application.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
})

ipcMain.handle('quit-app', (event)=> app.quit());
/*
  IPCMAIN SIGNALS=========================================================================================================
*/

//all-purpose window close signal, don't use for main view though, main view gets its own where it quits whole app.
ipcMain.handle('close-window', (event)=>{
  let srcWindow = BrowserWindow.fromId(event.sender.id);
  srcWindow.close();
  mainWindow.focus();
});

/**
 * SIGNAL - SAVE CSV UNIT DATA
 */
ipcMain.handle('ub-dialog-save-csv', async (event, dialogConfig, filedata)=>{
  let srcWindow = BrowserWindow.fromId(event.sender.id);
  dialogConfig.defaultPath = path.join(__dirname,'../../');
  dialog.showSaveDialog(srcWindow, dialogConfig).then( file =>{
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

/**
 * SIGNAL - LOAD CSV UNIT DATA
 */
ipcMain.handle('ub-dialog-load-async', async (event, dialogConfig)=>{
  let srcWindow = BrowserWindow.fromId(event.sender.id);
  dialogConfig.defaultPath = path.join(__dirname,'../../');
  let importData = [];
  dialog.showOpenDialog(srcWindow, dialogConfig).then( (file) =>{
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
        srcWindow.webContents.send('ub-dialog-load-response', JSON.stringify(importData));
      });
    }
  });
});

/**
 * SIGNAL - OPEN RULES PAGE AS WINDOW
 */
ipcMain.handle('rb-open-rules-core', (event)=>{
  if(rulesWindow != null){
    if(isAppWindowOpen(rulesWindow)){
      rulesWindow.close();
      windows.delete(rulesWindow);
      rulesWindow = null;
    }
  }

  rulesWindow = new BrowserWindow({
    width: 800,
    height: 1280,
    webPreferences: {
      contextIsolation: true
    }
  });
  windows.add(rulesWindow);
  rulesWindow.loadFile('src/html/layout/pages/rulebooks/rulebook_core.html');
  rulesWindow.focus();
});


ipcMain.handle('rb-open-rules-quick', (event)=>{
  if(rulesInfoWindow != null){
    if(isAppWindowOpen(rulesInfoWindow)){
      rulesInfoWindow.close();
      windows.delete(rulesInfoWindow);
      rulesInfoWindow = null;
    }
  }

  rulesInfoWindow = new BrowserWindow({
    width: 800,
    height: 1280,
    webPreferences: {
      contextIsolation: true
    }
  });
  windows.add(rulesInfoWindow);
  rulesInfoWindow.loadFile('src/html/layout/pages/rulebooks/rulebook_quickplay.html');
  rulesInfoWindow.focus();
});


/**
 * SIGNAL - SAVE RULES TO PDF
 */
ipcMain.handle('rb-save-rules-core', (event, pdfSavedialog, pdfOptionSave)=>{

  if(rulesWindow != null){
    if(isAppWindowOpen(rulesWindow)){
      rulesWindow.close();
      windows.delete(rulesWindow);
      rulesWindow = null;
    }
  }

  rulesWindow = new BrowserWindow({
    width: 637.5,
    maxWidth: 637.5,
    height: 825,
    webPreferences: {
      contextIsolation: true
    }
  });
  windows.add(rulesWindow);
  rulesWindow.loadFile('src/html/layout/pages/rulebooks/rulebook_core.html');
  rulesWindow.focus();

  pdfSavedialog.defaultPath = path.join(__dirname,'../../');

  dialog.showSaveDialog(rulesWindow, pdfSavedialog).then( file =>{
    console.log(file); 
    if(!file.canceled){
      let win = BrowserWindow.getFocusedWindow();

      win.webContents.printToPDF(pdfOptionSave).then(data => {
          fs.writeFile(file.filePath.toString(), data, function (err) {
              if (err) {
                  console.log(err);
              } else {
                  console.log('PDF Generated Successfully');
                  windows.delete(rulesWindow);
                  rulesWindow.close();
                  rulesWindow = null;
              }
          });
      }).catch(error => {
          console.log(error)
      });
    }
  });
})

ipcMain.handle('rb-save-rules-quick', (event, pdfSavedialog, pdfOptionSave)=>{

  if(rulesWindow != null){
    if(isAppWindowOpen(rulesWindow)){
      rulesWindow.close();
      windows.delete(rulesWindow);
      rulesWindow = null;
    }
  }

  rulesWindow = new BrowserWindow({
    width: 637.5,
    maxWidth: 637.5,
    height: 825,
    webPreferences: {
      contextIsolation: true
    }
  });
  windows.add(rulesWindow);
  rulesWindow.loadFile('src/html/layout/pages/rulebooks/rulebook_quickplay.html');
  rulesWindow.focus();

  pdfSavedialog.defaultPath = path.join(__dirname,'../../');

  dialog.showSaveDialog(rulesWindow, pdfSavedialog).then( file =>{
    console.log(file); 
    if(!file.canceled){
      let win = BrowserWindow.getFocusedWindow();

      win.webContents.printToPDF(pdfOptionSave).then(data => {
          fs.writeFile(file.filePath.toString(), data, function (err) {
              if (err) {
                  console.log(err);
              } else {
                  console.log('PDF Generated Successfully');
                  windows.delete(rulesWindow);
                  rulesWindow.close();
                  rulesWindow = null;
              }
          });
      }).catch(error => {
          console.log(error)
      });
    }
  });
})


ipcMain.handle('tag-save-core', (event, pdfSavedialog, pdfOptionSave)=>{

  if(tagCoreWindow != null){
    if(isAppWindowOpen(tagCoreWindow)){
      tagCoreWindow.close();
      windows.delete(tagCoreWindow);
      tagCoreWindow = null;
    }
  }

  tagCoreWindow = new BrowserWindow({
    width: 637.5,
    maxWidth: 637.5,
    height: 825,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, '../js/preload.js'),
    }
  });
  windows.add(tagCoreWindow);
  tagCoreWindow.loadFile('src/html/layout/pages/tagLibrary/tagLibPrintCore.html');
  tagCoreWindow.focus();

pdfSavedialog.defaultPath = path.join(__dirname,'../../');

  dialog.showSaveDialog(tagCoreWindow, pdfSavedialog).then( file =>{
    console.log(file); 
    if(!file.canceled){
      let win = BrowserWindow.getFocusedWindow();

      win.webContents.printToPDF(pdfOptionSave).then(data => {
          fs.writeFile(file.filePath.toString(), data, function (err) {
              if (err) {
                  console.log(err);
              } else {
                  console.log('PDF Generated Successfully');
                  windows.delete(tagCoreWindow);
                  tagCoreWindow.close();
                  tagCoreWindow = null;
              }
          });
      }).catch(error => {
          console.log(error)
      });
    }
  });
})



/**
 * SIGNAL - UNIT BUILDER NEW SHEET
 */
function createWindowUnitSheet(){
  let ubSheetNew = new BrowserWindow({
    width: 1280,
    height: 1024,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, '../js/preload.js')
    }
  });

  ubSheetNew.on('close', ()=>{
    windowsUBSheets.delete(ubSheetNew);
    ubSheetNew = null;
  });
  ubSheetNew.loadFile('src/html/layout/pages/unitBuilder/unitbuilderSheet.html');
  
  windowsUBSheets.add(ubSheetNew);

  return ubSheetNew;
}

ipcMain.handle('ub-open-sheet-new', (event)=>{
  let ubSheetNew = createWindowUnitSheet();
  ubSheetNew.focus();
});

ipcMain.handle('ub-open-sheet-import', async (event, dialogConfig)=>{
  let newWindow = createWindowUnitSheet();
  dialogConfig.defaultPath = path.join(__dirname,'../../');
  let importData = [];
  dialog.showOpenDialog(newWindow, dialogConfig).then( (file) =>{
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
            newWindow.close();
          }
      })
      .on('end',()=>{
        let dataString =  JSON.stringify(importData);
        if(dataString.length > 0){
            newWindow.focus();
            newWindow.webContents.send('ub-dialog-load-response', JSON.stringify(importData));
        }
        else{
          newWindow.close();
        }
      });
    }
  });
});



/**
 * SIGNAL - UNIT INFO CARD - New Sheet
 */
function createWindowUnitCard(){
  let ubSheetNew = new BrowserWindow({
    width: 1280,
    height: 1024,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, '../js/preload.js')
    }
  });

  ubSheetNew.on('close', ()=>{
    windowsUBSheets.delete(ubSheetNew);
    ubSheetNew = null;
  });
  ubSheetNew.loadFile('src/html/layout/pages/unitCardGen/unitCardSheet.html');
  
  windowsUBSheets.add(ubSheetNew);

  return ubSheetNew;
}

 ipcMain.handle('uic-open-sheet-new', (event)=>{
  let ubSheetNew = createWindowUnitCard();
  ubSheetNew.focus();
});

ipcMain.handle('uic-open-sheet-import', async (event, dialogConfig)=>{
  let newWindow = createWindowUnitCard();
  dialogConfig.defaultPath = path.join(__dirname,'../../');
  let importData = [];
  dialog.showOpenDialog(newWindow, dialogConfig).then( (file) =>{
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
            newWindow.close();
          }
      })
      .on('end',()=>{
        let dataString =  JSON.stringify(importData);
        if(dataString.length > 0){
            newWindow.focus();
            newWindow.webContents.send('uic-dialog-load-response', JSON.stringify(importData));
        }
        else{
          newWindow.close();
        }
      });
    }
  });
});

ipcMain.handle('uic-save-sheet', (event, pdfSavedialog, pdfOptionSave, unitCardData)=>{
  let srcWindow = BrowserWindow.fromId(event.sender.id);
  
  pdfSavedialog.defaultPath = path.join(__dirname,'../../');

  dialog.showSaveDialog(srcWindow, pdfSavedialog).then( file =>{
    console.log(file); 
    if(!file.canceled){
      srcWindow.webContents.printToPDF(pdfOptionSave).then(data => {
          fs.writeFile(file.filePath.toString(), data, function (err) {
            srcWindow.close();
              if (err) {
                  console.log(err);
              } else {
                  console.log('PDF Generated Successfully');
              }
          });
      }).catch(error => {
          console.log(error);
          srcWindow.close();
      });
    }
  });
})