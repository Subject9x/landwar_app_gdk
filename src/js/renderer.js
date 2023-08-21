/*
    Renderer.js component for Electron
*/
const navBar = $('#tagNavBar')[0];
const pageLanding = $('#pageLanding')[0];
const pageRulebooks = $('#pageRulebooks')[0];
const pageTagLib = $('#pageTagLib')[0];
const pageUnitBuild = $('#pageUnitBuild')[0];
const pageUnitCards = $('#pageUnitCardGen')[0];
const pageForceBuild = $('#pageForceBuild')[0];


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
    window.api.send('rb-open-rules', 'rulebook_core');
}

function rb_rules_open_quickplay(){
    window.api.send('rb-open-rules', 'rulebook_quickplay');
}

function rb_scenarios_open_core(){
    window.api.send('rb-open-rules', 'rulebook_scenarios_basic');
}

function rb_rules_pdf_core(){
    window.api.send('rb-save-rules-core', dialogSavePDFOptions, pdfSaveOptions);
}

function rb_rules_pdf_quick(){
    window.api.send('rb-save-rules-quick', dialogSavePDFOptions, pdfSaveOptions);
}

function rb_scenarios_save_core(){
    window.api.send('rb-save-scenario', dialogSavePDFOptions, pdfSaveOptions);
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
    //Army Builder covers this functionality, users will make heterogenous unit card lists via the Army Builder.
    //window.api.send('uic-open-sheet-new');
}

function ucg_control_sheet_import(){
    window.api.send('uic-open-sheet-import', dialogLoadOptionsUnitList);
}


function ucg_print_blanks_pdf(event){
    event.preventDefault();

    let inputTotal = document.getElementById('uicBlankCopies');
    let copyTotal = parseInt(inputTotal.value);

    if(copyTotal > 0){
        let exportData = [];

        for(let i = 0; i < copyTotal; i++){
            let data = {};
            data.unitName = "";
            data.size = "";
            data.move = "";
            data.evade = "";
            data.dmgMelee = "";
            data.dmgRange = "";
            data.range = "";
            data.armor = "";
            //data.structure = "";
            data.points = "";
            data.tags = "";
            data.tagTotal = "";
            data.completeTotal = "";
            exportData.push(data);
        }
        window.api.send('ub-dialog-send-cardgen', exportData);
    }
}

/*
    Javascript layer for page: ArmyBuilder
*/

function armb_control_sheet_new(){
    window.api.send('ab-open-sheet-new');
}

function armb_control_sheet_import(){
    window.api.send('ab-open-sheet-import', dialogLoadOptionsUnitList);
}