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
    
    console.log("MAIN WINDOW ID" + window.id); //debug

    if(tagView !== null && tagView !== undefined){
        tagView.style.display = 'none';
        tagView.setAttribute('hidden', 'true');
        tagView.innerHTML ='';
    }
}

function page_change_to(from ,to){

}