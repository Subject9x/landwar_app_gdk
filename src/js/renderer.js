/*
    Renderer.js component for Electron
*/
const navBar = document.getElementById('tagNavBar');
const pageLanding = document.getElementById('pageLanding');
const pageUnitBuild = document.getElementById('pageUnitBuild');

//window = remote.getCurrentWindow();

//document ready
document.addEventListener('DOMContentLoaded',function(){

    navBar.innerHTML = window.nodeFileSys.loadFile('src/html/layout/navbar_default.html');

    pageLanding.innerHTML = window.nodeFileSys.loadFile('src/html/pages/landing.html');
  
    pageUnitBuild.innerHTML = window.nodeFileSys.loadFile('src/html/pages/unitBuilder.html');

    document.getElementById('btnUnitBuilder').addEventListener('click', ()=>{
        pageUnitBuild.setAttribute('hidden', 'false');
        pageLanding.setAttribute('hidden', 'true');
    })
})
