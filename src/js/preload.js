// preload.js

const {contextBridge, ipcRenderer, remote} = require('electron')
const fs = require('fs')

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
  
  /*fs.readFile('src/html/layout/navbar_default.html', (err, data) => {
    document.getElementById('tagNavBar').innerHTML = data;
  })

  fs.readFile('src/html/pages/landing.html', (err, data) => {
      document.getElementById('pageLanding').innerHTML = data;
  })

  fs.readFile('src/html/pages/unitBuilder.html', (err, data) => {
      document.getElementById('pageUnitBuild').innerHTML = data;
  })*/



  /*const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }*/
})