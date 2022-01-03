// preload.js

const {contextBridge, ipcRenderer, remote} = require('electron')
const fs = require('fs')

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
      return fs.readFileSync(fileName, 'utf-8')
    }
  }
)

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {

})