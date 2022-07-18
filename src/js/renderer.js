/*
    Renderer.js component for Electron
*/
const navBar = document.getElementById('tagNavBar');
const pageLanding = document.getElementById('pageLanding');
const pageRulebooks = document.getElementById('pageRulebooks');
const pageUnitBuild = document.getElementById('pageUnitBuild');
const pageTagLib = document.getElementById('pageTagLib');

const PAGE_HOME = 0;
const PAGE_RULES = 1;
const PAGE_TAGLIB = 2;
const PAGE_UNITBUILD = 3;
const PAGE_ARMYLIST = 4;

let activePage;

let activatePage = PAGE_HOME;

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

const dialogSavePDFOptions ={
    title : 'save rules pdf',
    buttonLabel : 'Save',
    filters : [{name : 'PDF Files', extensions : ['pdf']}],
    properties : ['createDirectory', 'showOverwriteConfirmation']
}

const pdfSaveOptions = {
    marginsType: 0,
    pageSize: 'A4',
    printBackground: false,
    printSelectionOnly: false,
    landscape: false
}


api.handle( 'ub-dialog-load-response', ( event, data ) => function( event, data ) {
    if(data.length > 0){
        file_unitBuild_import(data);
    }
}, event);



function page_leave_taglib(){
    let tagView = document.getElementById('tagView');

    if(tagView !== null){
        tagView.style.display = 'none';
        tagView.setAttribute('hidden', 'true');
        tagView.innerHTML ='';
    }
}

function page_change_to(from ,to){

}

//document ready
document.addEventListener('DOMContentLoaded',function(){

    /*
        Build index.html with everything needed.
    */
    navBar.innerHTML = window.nodeFileSys.loadHTML('layout/navbar_default.html');

    pageLanding.innerHTML = window.nodeFileSys.loadHTML('pages/landing.html');

    pageRulebooks.innerHTML = window.nodeFileSys.loadHTML('pages/rulebooks.html');
    pageRulebooks.setAttribute('hidden', 'true');
  
    pageUnitBuild.innerHTML = window.nodeFileSys.loadHTML('pages/unitBuilder.html');
    pageUnitBuild.setAttribute('hidden', 'true');

    pageTagLib.innerHTML = window.nodeFileSys.loadHTML('pages/tagLib.html');
    pageTagLib.setAttribute('hidden', 'true');


    /*
        NAV BAR
    */
    $('#navHome')[0].addEventListener('click', ()=>{
        pageLanding.removeAttribute('hidden');
        pageRulebooks.setAttribute('hidden', 'true');
        pageUnitBuild.setAttribute('hidden', 'true');
        pageTagLib.setAttribute('hidden', 'true');
        page_leave_taglib();
    });
    $('#navRulebooks')[0].addEventListener('click', ()=>{
        pageRulebooks.removeAttribute('hidden');
        pageLanding.setAttribute('hidden', 'true');
        pageUnitBuild.setAttribute('hidden', 'true');
        pageTagLib.setAttribute('hidden', 'true');
        page_leave_taglib();
    });
    $('#navTagRules')[0].addEventListener('click', ()=>{
        pageTagLib.removeAttribute('hidden');
        pageRulebooks.setAttribute('hidden', 'true');
        pageUnitBuild.setAttribute('hidden', 'true');
        pageLanding.setAttribute('hidden', 'true');
    });
    $('#navUnitBuild')[0].addEventListener('click', ()=>{
        pageUnitBuild.removeAttribute('hidden');
        pageRulebooks.setAttribute('hidden', 'true');
        pageLanding.setAttribute('hidden', 'true');
        pageTagLib.setAttribute('hidden', 'true');
        page_leave_taglib();
    });
    
    $('#navArmyList')[0].setAttribute('disabled', 'true');

    /*
        Page: Landing
    */

    /*
        Page: Rulebooks
    */
    $('#btnCoreRules')[0].addEventListener('click', ()=>{
        rb_rules_open_core();
    });
    $('#btnCoreRulesSave')[0].addEventListener('click', ()=>{
        rb_rules_pdf_core();
    });
    $('#btnCoreQuick')[0].addEventListener('click', ()=>{
        rb_rules_open_quickplay();
    });

    /*
        Page: Tag Lib
    */
    tl_buildTable();

    /*
        Page: UnitBuilder
    */
    $('#btnAddUnit')[0].addEventListener('click', ()=>{
        ub_row_add();
    });

    $('#btnRemoveUnit')[0].addEventListener('click', () => {
        ub_row_remove();
    });
});