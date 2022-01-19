// preload.js

const {contextBridge, ipcRenderer, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');

/*
  contextBridge -
    from what I can tell, you use it to securely wrap node_modules and only pass the explicit functions
    you'd like to use. Example is the file loader.
      create a custom api name, which is called via window.[key].
      then enumeratee the functions you want to wrap.
*/

//example ipc channels, can then be referenced by /renderer.js
contextBridge.exposeInMainWorld('darkMode',{
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system')
})

/*
  Wrapped FS loader
*/
contextBridge.exposeInMainWorld(
  'nodeFileSys',
  {
    loadFile(fileName){
      let pathDir = path.join(__dirname, fileName);
      return fs.readFileSync(pathDir, 'utf-8');
    },
    loadJS(fileName){
      let pathDir = path.join(__dirname, fileName);
      return fs.readFileSync(pathDir, 'utf-8');
    },
    loadHTML(fileName){
      let pathDir = path.join(__dirname, '../html/'+fileName);
      return fs.readFileSync(pathDir, 'utf-8');
    }
  }
)

contextBridge.exposeInMainWorld(
  'dialogSys',
  {
    ubSaveDialog(event, fileData, config){
      ipcRenderer.sendSync('ub-dialog-save', event, fileData, config);
      //console.log(testResponse);
    },
    ubLoadDialog(event, config){
      let getData = ipcRenderer.sendSync('ub-dialog-load', event, config);
      return getData;
    }
  }
)



// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {

})