/*
    Renderer.js component for Electron
*/
const navBar = $('#tagNavBar')[0];
const pageLanding = $('#pageLanding')[0];
const pageRulebooks = $('#pageRulebooks')[0];
const pageUnitBuild = $('#pageUnitBuild')[0];
const pageTagLib = $('#pageTagLib')[0];

const PAGE_HOME = 0;
const PAGE_RULES = 1;
const PAGE_TAGLIB = 2;
const PAGE_UNITBUILD = 3;
const PAGE_ARMYLIST = 4;

let activePage;

let activatePage = PAGE_HOME;

function page_leave_taglib(){
    let tagView = $('#tagView')[0];
    
    if(tagView !== null && tagView !== undefined){
        tagView.style.display = 'none';
        tagView.setAttribute('hidden', 'true');
        tagView.innerHTML ='';
    }
}

function page_change_to(from ,to){

}

function nav_exit(){
    window.api.send('quit-app');
}


/*
    RULEBOOK PAGE FUNCTIONS
*/

function rb_rules_open_core(){
    window.api.send('rb-open-rules-core');
}

function rb_rules_open_quickplay(){
    window.api.send('rb-open-rules-quick');
}

function rb_rules_pdf_core(){
    window.api.send('rb-save-rules-core', dialogSavePDFOptions, pdfSaveOptions);
}

function rb_rules_pdf_quick(){
    window.api.send('rb-save-rules-quick', dialogSavePDFOptions, pdfSaveOptions);
}

/*
    Javascript layer for page: UnitBuilder
*/

function ub_control_sheet_new(){
    window.api.send('ub-open-sheet-new');
}

function ub_control_sheet_import(){
    window.api.send('ub-open-sheet-import', dialogLoadOptionsUnitList);
}

/*
    Javascript layer for page: UnitCardgenerator
*/

function ucg_control_sheet_new(){
    window.api.send('uic-open-sheet-new');
}

function ucg_control_sheet_import(){
    window.api.send('uic-open-sheet-import', dialogLoadOptionsUnitList);
}