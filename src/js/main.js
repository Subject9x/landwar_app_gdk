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

let lastWindowFocused;  //track users previous window if its not closed
let lastFilePathUsed; //tracks last folder path the user used.

const windows = new Set();

let basepath = app.getAppPath();

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
      contextIsolation: true,
      nodeIntegration: true,
      devTools : true,
      frame : false
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
}

function setLastWindow(prevWindow){
  if(prevWindow !== null && prevWindow !== undefined){
    lastWindowFocused = prevWindow;
  }
  else{
    lastWindowFocused = mainWindow;
  }
}

function close_window(evt, window){
  
  if(window === lastWindowFocused){
    lastWindowFocused = mainWindow;
  }
  else{
    if(lastWindowFocused !== null && lastWindowFocused !== undefined){
      lastWindowFocused.focus();
    }
    else{
      mainWindow.focus();
      lastWindowFocused = mainWindow;
    }
  }
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
  lastFilePathUsed = basepath;
})

ipcMain.handle('quit-app', (event)=> app.quit());
/*
  IPCMAIN SIGNALS=========================================================================================================
*/

//all-purpose window close signal, don't use for main view though, main view gets its own where it quits whole app.
ipcMain.handle('close-window',  (evt, arg) =>{
  evt.preventDefault();
  let srcWindow = BrowserWindow.fromId(evt.sender.id);

  if(srcWindow === lastWindowFocused){
    lastWindowFocused = mainWindow;
  }
  else{
    if(lastWindowFocused !== null && lastWindowFocused !== undefined){
      lastWindowFocused.focus();
    }
    else{
      mainWindow.focus();
      lastWindowFocused = mainWindow;
    }
  }
  if(srcWindow !== null && srcWindow !== undefined){
    srcWindow.hide();
    setTimeout(() => {
      srcWindow.close();
      srcWindow = null;
    }, 500);
  }
});


/**
 * SIGNAL - SAVE CSV UNIT DATA
 */
ipcMain.handle('ub-dialog-save-csv', async (event, dialogConfig, filedata)=>{
  let srcWindow = BrowserWindow.fromId(event.sender.id);
  
  dialogConfig.defaultPath = lastFilePathUsed;
  
  dialog.showSaveDialog(srcWindow, dialogConfig).then( file =>{
    if(!file.canceled){
      lastFilePathUsed = file.filePath;
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
      srcWindow.webContents.send('ub-dialog-save-response', file.filePath);
    }
  });
});

/**
 * SIGNAL - LOAD CSV UNIT DATA
 */
ipcMain.handle('ub-dialog-load-async', async (event, dialogConfig)=>{
  let srcWindow = BrowserWindow.fromId(event.sender.id);
  
  dialogConfig.defaultPath = lastFilePathUsed;
  
  let importData = [];
  let errrr;
  dialog.showOpenDialog(srcWindow, dialogConfig).then( (file) =>{
    if(!file.canceled && file.filePaths.length > 0){
      lastFilePathUsed = file.filePath;
      let reader = fs
      .createReadStream(file.filePaths[0].toString())
      .pipe(csv({separator : ','}))
      .on('data', (data) => {
          try {
            importData.push(data);
          }
          catch(err) {
            console.log(err.stack);
            errrr = err;
          }
      })
      .on('error', function(err){
        console.log(err.stack);
        errrr = err;
      })
      .on('end',()=>{
        if(importData.length > 0){
          if(srcWindow != null && srcWindow != undefined){
            srcWindow.webContents.send('ub-dialog-load-response', JSON.stringify(importData), "");
          }
        }
      });
    }
  });
});

/**
 * SIGNAL - OPEN RULES PAGE AS WINDOW
 */
ipcMain.handle('rb-open-rules', (event, htmlFile)=>{
  if(rulesWindow != null){
    if(isAppWindowOpen(rulesWindow)){
      rulesWindow.close();
      rulesWindow = null;
    }
  }

  rulesWindow = new BrowserWindow({
    width: 800,
    height: 1280,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      devTools : false,
      frame : false
    }
  });
  
  setLastWindow(BrowserWindow.fromId(event.sender.id));

  rulesWindow.loadFile('src/html/layout/pages/rulebooks/'+htmlFile+'.html');
  rulesWindow.focus();
});



/**
 * SIGNAL - SAVE RULES TO PDF
 */
ipcMain.handle('rb-save-rules', (event, pdfSavedialog, pdfOptionSave, html)=>{

  if(rulesWindow != null){
    if(isAppWindowOpen(rulesWindow)){
      rulesWindow.close();
      rulesWindow = null;
    }
  }

  rulesWindow = new BrowserWindow({
    width: 637.5,
    maxWidth: 637.5,
    height: 825,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      devTools : false,
      frame : false
    }
  });
  rulesWindow.loadFile('src/html/layout/pages/rulebooks/'+ html +'.html');
  rulesWindow.focus();
  rulesWindow.on('ready-to-show', ()=>{
    pdfSavedialog.defaultPath = lastFilePathUsed;

    dialog.showSaveDialog(rulesWindow, pdfSavedialog).then( file =>{
      console.log(file); 
      if(!file.canceled){
        lastFilePathUsed = file.filePath;
        let win = BrowserWindow.getFocusedWindow();
  
        win.webContents.printToPDF(pdfOptionSave).then(data => {
            fs.writeFile(file.filePath.toString(), data, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('PDF Generated Successfully');
                    rulesWindow.close();
                    rulesWindow = null;
                }
            });
        }).catch(error => {
            console.log(error)
        });
      }
    });
  });
})

ipcMain.handle('rb-save-rules-quick', (event, pdfSavedialog, pdfOptionSave)=>{

  if(rulesWindow != null){
    if(isAppWindowOpen(rulesWindow)){
      rulesWindow.close();
      rulesWindow = null;
    }
  }

  rulesWindow = new BrowserWindow({
    width: 637.5,
    maxWidth: 637.5,
    height: 825,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      devTools : false,
      frame : false
    }
  });
  rulesWindow.loadFile('src/html/layout/pages/rulebooks/rulebook_quickplay.html');
  rulesWindow.focus();

  pdfSavedialog.defaultPath = lastFilePathUsed;

  dialog.showSaveDialog(rulesWindow, pdfSavedialog).then( file =>{
    console.log(file); 
    if(!file.canceled){
      lastFilePathUsed = file.filePath;
      let win = BrowserWindow.getFocusedWindow();

      win.webContents.printToPDF(pdfOptionSave).then(data => {
          fs.writeFile(file.filePath.toString(), data, function (err) {
              if (err) {
                  console.log(err);
              } else {
                  console.log('PDF Generated Successfully');
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

ipcMain.handle('rb-save-scenario', (event, pdfSavedialog, pdfOptionSave)=>{

  if(rulesWindow != null){
    if(isAppWindowOpen(rulesWindow)){
      rulesWindow.close();
      rulesWindow = null;
    }
  }

  rulesWindow = new BrowserWindow({
    width: 637.5,
    maxWidth: 637.5,
    height: 825,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      devTools : false,
      frame : false
    }
  });
  rulesWindow.loadFile('src/html/layout/pages/rulebooks/rulebook_scenarios_basic.html');
  rulesWindow.focus();

  pdfSavedialog.defaultPath = lastFilePathUsed;

  dialog.showSaveDialog(rulesWindow, pdfSavedialog).then( file =>{
    console.log(file); 
    if(!file.canceled){
      lastFilePathUsed = file.filePath;
      let win = BrowserWindow.getFocusedWindow();

      win.webContents.printToPDF(pdfOptionSave).then(data => {
          fs.writeFile(file.filePath.toString(), data, function (err) {
              if (err) {
                  console.log(err);
              } else {
                  console.log('PDF Generated Successfully');
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
      nodeIntegration: true,
      devTools : false,
      frame : false
    }
  });
  tagCoreWindow.loadFile('src/html/layout/pages/tagLibrary/tagLibPrintCore.html');
  tagCoreWindow.focus();

pdfSavedialog.defaultPath = lastFilePathUsed;

  dialog.showSaveDialog(tagCoreWindow, pdfSavedialog).then( file =>{
    console.log(file); 
    if(!file.canceled){
      lastFilePathUsed = file.filePath;
      let win = BrowserWindow.getFocusedWindow();

      win.webContents.printToPDF(pdfOptionSave).then(data => {
          fs.writeFile(file.filePath.toString(), data, function (err) {
              if (err) {
                  console.log(err);
              } else {
                  console.log('PDF Generated Successfully');
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

ipcMain.handle('rb-save-unit-cost', (event, pdfSavedialog, pdfOptionSave)=>{

  if(tagCoreWindow != null){
    if(isAppWindowOpen(tagCoreWindow)){
      tagCoreWindow.close();
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
      nodeIntegration: true,
      devTools : false,
      frame : false
    }
  });
  tagCoreWindow.loadFile('src/html/layout/pages/rulebooks/rulebook_core_unit_cost.html');
  tagCoreWindow.focus();

pdfSavedialog.defaultPath = lastFilePathUsed;

  dialog.showSaveDialog(tagCoreWindow, pdfSavedialog).then( file =>{
    console.log(file); 
    if(!file.canceled){
      lastFilePathUsed = file.filePath;
      let win = BrowserWindow.getFocusedWindow();

      win.webContents.printToPDF(pdfOptionSave).then(data => {
          fs.writeFile(file.filePath.toString(), data, function (err) {
              if (err) {
                  console.log(err);
              } else {
                  console.log('PDF Generated Successfully');
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
      preload: path.join(__dirname, '../js/preload.js'),
      nodeIntegration: true,
      devTools : true,
      frame : false
    }
  });

  ubSheetNew.loadFile('src/html/layout/pages/unitBuilder/unitbuilderSheet.html');
  return ubSheetNew;
}

ipcMain.handle('ub-open-sheet-new', (event)=>{
  let ubSheetNew = createWindowUnitSheet();
  
  setLastWindow(BrowserWindow.fromId(event.sender.id));
  //ubSheetNew.focus();

  
  ubSheetNew.once('ready-to-show', () => {
    ubSheetNew.show();
    ubSheetNew.focus();
  });

});

ipcMain.handle('ub-open-sheet-import', async (event, dialogConfig)=>{
  let newWindow = createWindowUnitSheet();

  dialogConfig.defaultPath = lastFilePathUsed;
  
  let importData = [];

  newWindow.webContents.on('did-finish-load', () => {
    dialog.showOpenDialog(newWindow, dialogConfig).then( (file) =>{
      if(!file.canceled && file.filePaths.length > 0){
        lastFilePathUsed = file.filePath;
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
              setLastWindow(BrowserWindow.fromId(event.sender.id));
              newWindow.webContents.send('ub-dialog-load-response', JSON.stringify(importData), file.filePaths[0]);
              
              newWindow.once('ready-to-show', () => {
                newWindow.show();
                newWindow.focus();
              });
          }
          else{
            newWindow.close();
          }
        });
      }
    });
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
      preload: path.join(__dirname, '../js/preload.js'),
      nodeIntegration: true,
      devTools : true,
      frame : false
    }
  });  
  
  ubSheetNew.loadFile('src/html/layout/pages/unitCardGen/unitCardSheet.html');

  return ubSheetNew;
}


ipcMain.handle('ub-dialog-send-cardgen', (event, unitData) => {
  let newWindow = createWindowUnitCard();

  newWindow.webContents.on('did-finish-load', () => {
    if(unitData.length > 0){
      let dataString = JSON.stringify(unitData);
      
      setLastWindow(BrowserWindow.fromId(event.sender.id));

      newWindow.webContents.send('uic-dialog-load-response', dataString);
      newWindow.focus();

    }
    else{
      newWindow.close();
    }
  });
});


 ipcMain.handle('uic-open-sheet-new', (event)=>{
  let ubSheetNew = createWindowUnitCard();

  setLastWindow(BrowserWindow.fromId(event.sender.id));

  ubSheetNew.focus();
});

ipcMain.handle('uic-open-sheet-import', async (event, dialogConfig)=>{
  let newWindow = createWindowUnitCard();
  
  dialogConfig.defaultPath = lastFilePathUsed;

  let importData = [];
  dialog.showOpenDialog(newWindow, dialogConfig).then( (file) =>{
    if(!file.canceled && file.filePaths.length > 0){
      lastFilePathUsed = file.filePath;
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
        if(importData.length > 0){
            let dataString = JSON.stringify(importData);
            
            setLastWindow(BrowserWindow.fromId(event.sender.id));

            newWindow.webContents.send('uic-dialog-load-response', dataString);
            newWindow.focus();
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
  
  pdfSavedialog.defaultPath = lastFilePathUsed;

  dialog.showSaveDialog(srcWindow, pdfSavedialog).then( file =>{
    if(!file.canceled){
      lastFilePathUsed = file.filePath;
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

/**
 * SIGNAL - UNIT INFO CARD - New Sheet
 */
 function createWindowArmyBuilder(){
  let abSheetNew = new BrowserWindow({
    width: 1280,
    height: 1024,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, '../js/preload.js'),
      nodeIntegration: true,
      devTools : true,
      frame : false
    }
  });

  abSheetNew.loadFile('src/html/layout/pages/armyBuilder/armyBuilderSheet.html');

  return abSheetNew;
}

ipcMain.handle('ab-open-sheet-new', (event)=>{
  let abSheetNew = createWindowArmyBuilder();
  
  setLastWindow(BrowserWindow.fromId(event.sender.id));

  abSheetNew.focus();
});

ipcMain.handle('ab-open-sheet-import', async (event, dialogConfig)=>{
  let newWindow = createWindowArmyBuilder();
  
  dialogConfig.defaultPath = lastFilePathUsed;
  
  let importData = [];

  newWindow.webContents.on('did-finish-load', () => {
    dialog.showOpenDialog(newWindow, dialogConfig).then( (file) =>{
      if(!file.canceled && file.filePaths.length > 0){
        lastFilePathUsed = file.filePath;
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
              setLastWindow(BrowserWindow.fromId(event.sender.id));

              newWindow.focus();
              newWindow.webContents.send('ab-dialog-load-response', JSON.stringify(importData), file.filePaths[0]);
          }
          else{
            newWindow.close();
          }
        });
      }
    });
  });
});


ipcMain.handle('ab-open-sheet-import-info', async (event, dialogConfig)=>{
  let srcWindow = BrowserWindow.fromId(event.sender.id);
  
  dialogConfig.defaultPath = lastFilePathUsed;
  
  let importData = [];
  
  dialog.showOpenDialog(srcWindow, dialogConfig).then( (file) =>{
    if(!file.canceled && file.filePaths.length > 0){
      lastFilePathUsed = file.filePath;
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
      .on('error', function(error){
        
      })
      .on('end',()=>{
        let dataString = JSON.stringify(importData);
        if(dataString != undefined && srcWindow != null && srcWindow != undefined){
          srcWindow.webContents.send('ab-dialog-load-response-unitinfo', dataString, file.filePaths[0]);
        }
      });
    }
  });
});

ipcMain.handle('ab-dialog-load-async', async (event, dialogConfig)=>{
  let srcWindow = BrowserWindow.fromId(event.sender.id);
  
  dialogConfig.defaultPath = lastFilePathUsed;
  
  let importData = [];
  dialog.showOpenDialog(srcWindow, dialogConfig).then( (file) =>{
    if(!file.canceled && file.filePaths.length > 0){
      lastFilePathUsed = file.filePath;
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
        if(importData.length > 0 ){
          let dataString = JSON.stringify(importData);  
          if(dataString != undefined && srcWindow != null && srcWindow != undefined){
            srcWindow.webContents.send('ab-dialog-load-response', dataString, file.filePaths[0]);  
          }
        }
      });
    }
  });
});


function createWindowArmyBuildTagList() {
  let abTagList = new BrowserWindow({
    width: 1280,
    height: 1024,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, '../js/preload.js'),
      nodeIntegration: true,
      devTools : true,
      frame : false
    }
  });
  
  abTagList.loadFile('src/html/layout/pages/armyBuilder/armyListTagPrintable.html');
  
  return abTagList;
}

ipcMain.handle('ab-dialog-send-taglist', (event, pageData)=>{

  tagListWindow = createWindowArmyBuildTagList();
  tagListWindow.webContents.on('did-finish-load', () => {
    if(pageData.data.length > 0){
      let dataString = JSON.stringify(pageData);

      tagListWindow.webContents.send('ab-taglist-load-response', dataString);
      tagListWindow.focus();
    }
    else{
      tagListWindow.close();
    }
  });
})


ipcMain.handle('ab-print-taglist', (event, pdfSavedialog, pdfOptionSave)=>{
  let srcWindow = BrowserWindow.fromId(event.sender.id);


  pdfSavedialog.defaultPath = lastFilePathUsed;

  dialog.showSaveDialog(srcWindow, pdfSavedialog).then( file =>{
    if(!file.canceled){
      lastFilePathUsed = file.filePath;
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