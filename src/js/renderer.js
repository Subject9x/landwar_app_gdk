/*
    Renderer.js component for Electron
*/
const navBar = document.getElementById('tagNavBar');
const pageLanding = document.getElementById('pageLanding');
const pageUnitBuild = document.getElementById('pageUnitBuild');
const pageTagLib = document.getElementById('pageTagLib');

const dialogSaveOptionsUnitList = {
    title : 'Save File',
    buttonLabel: 'Save',
    filters : [{name : 'CSV Files', extensions : ['csv']}],
    properties : ['createDirectory', 'showOverwriteConfirmation']
}

const dialogLoadOptionsUnitList = {
    title : 'Load Unit List',
    buttonLabel: 'Open',
    filters : [{name : 'CSV Files', extensions : ['csv']}],
    properties : ['openFile']
}


api.handle( 'ub-dialog-load-response', ( event, data ) => function( event, data ) {
    if(data.length > 0){
        file_unitBuild_import(data);
    }
}, event);



//document ready
document.addEventListener('DOMContentLoaded',function(){

    /*
        Build index.html with everything needed.
    */
    navBar.innerHTML = window.nodeFileSys.loadHTML('layout/navbar_default.html');

    pageLanding.innerHTML = window.nodeFileSys.loadHTML('pages/landing.html');
  
    pageUnitBuild.innerHTML = window.nodeFileSys.loadHTML('pages/unitBuilder.html');
    pageUnitBuild.setAttribute('hidden', 'true');

    pageTagLib.innerHTML = window.nodeFileSys.loadHTML('pages/tagLib.html');
    pageTagLib.setAttribute('hidden', 'true');

    /*
        NAV BAR
    */
    document.getElementById('navHome').addEventListener('click', ()=>{
        pageLanding.removeAttribute('hidden');
        pageUnitBuild.setAttribute('hidden', 'true');
        pageTagLib.setAttribute('hidden', 'true');
    });
    document.getElementById('navCorerules').addEventListener('click', ()=>{
        // pageUnitBuild.removeAttribute('hidden');
        // pageLanding.setAttribute('hidden', 'true');
    });
    document.getElementById('navTagRules').addEventListener('click', ()=>{
        pageTagLib.removeAttribute('hidden');
        pageUnitBuild.setAttribute('hidden', 'true');
        pageLanding.setAttribute('hidden', 'true');
    });
    document.getElementById('navUnitBuild').addEventListener('click', ()=>{
        pageUnitBuild.removeAttribute('hidden');
        pageLanding.setAttribute('hidden', 'true');
        pageTagLib.setAttribute('hidden', 'true');
    });
    document.getElementById('navArmyList').addEventListener('click', ()=>{
        //pageUnitBuild.removeAttribute('hidden');
        //pageLanding.setAttribute('hidden', 'true');
    });

    /*
        Page: Landing
    */
    // document.getElementById('btnAddUnit').addEventListener('click', ()=>{
        // ub_row_add();
    // });

    /*
        Page: Tag Lib
    */
    tl_buildTable();

    /*
        Page: UnitBuilder
    */
    document.getElementById('btnAddUnit').addEventListener('click', ()=>{
        ub_row_add();
    });
});