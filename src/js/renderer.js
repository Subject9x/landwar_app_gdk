/*
    Renderer.js component for Electron
*/
const navBar = document.getElementById('tagNavBar');
const pageLanding = document.getElementById('pageLanding');
const pageUnitBuild = document.getElementById('pageUnitBuild');

//window = remote.getCurrentWindow();

//document ready
document.addEventListener('DOMContentLoaded',function(){

    /*
        Build index.html with everything needed.

    */
    navBar.innerHTML = window.nodeFileSys.loadFile('src/html/layout/navbar_default.html');

    pageLanding.innerHTML = window.nodeFileSys.loadFile('src/html/pages/landing.html');
  
    pageUnitBuild.innerHTML = window.nodeFileSys.loadFile('src/html/pages/unitBuilder.html');
    pageUnitBuild.setAttribute('hidden', 'true');

    /*
        Page: LandingPage
    */
    document.getElementById('btnUnitBuilder').addEventListener('click', ()=>{
        pageUnitBuild.removeAttribute('hidden');
        pageLanding.setAttribute('hidden', 'true');
    })

    /*
        Page: UnitBuilder
    */
    document.getElementById('btnAddUnit').addEventListener('click', ()=>{
        ub_row_add();
    })
})
