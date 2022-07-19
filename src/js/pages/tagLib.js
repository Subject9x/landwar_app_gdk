/*
    Page: TAG Library page
*/

let loadedTable = false;

function tl_buildTable(){
    if(loadedTable){
        return;
    }
    
    let tagTable = $('#tagLib_list>tbody')[0];
    let tagCount = 0;
    let celCount = 5;
    let tagRow;
   
    for(let tagId in tagInfo.data){
        let tagItem = tagInfo.data[tagId];
        
        if(celCount == 5){
            tagRow = tagTable.insertRow();
            celCount = 0;
        }
        
        let cel = document.createElement('td');
        cel.style = 'text-align:center;'
        cel.innerHTML = window.nodeFileSys.loadHTML('layout/pages/tagLibrary/tagTableItem.html');
        tagRow.appendChild(cel) ;

        let button =  cel.children[0];

        button.innerHTML = tagItem.title
        button.id = tagCount;
        button.addEventListener('click', ()=>{
            tl_showTag(cel.children[0].id);
        });

        celCount++;
        tagCount++;
    }
}


function tl_showTag(celData){
    let tagId = parseInt(celData);
    let tagViewModal = $('#tagLibModal')[0];
    
    tagViewModal.innerHTML = '';
    tagViewModal.removeAttribute('hidden');
    tagViewModal.innerHTML = window.nodeFileSys.loadHTML('layout/pages/tagLibrary/tagLibView.html');
   
    $('#tagView')[0].style.display = 'block';
    
    $('#tagViewClose')[0].addEventListener('click', ()=>{
        $('#tagLibModal')[0].setAttribute('hidden', 'true');
        $('#tagView')[0].style.display = 'none';
        $('#tagLibModal')[0].innerHTML = '';
    });

    let tagData = tagInfo.data[tagId];

    $('#tagWindow_descTitle')[0].innerHTML = '<h4>'+ tagData.title + '</h4>';
    $('#tagWindow_descText')[0].innerHTML = tagData.desc;
    $('#tagWindow_equation')[0].innerHTML = tagData.eqt;
    $('#tagWindow_descWarn')[0].innerHTML = tagData.reqs('blank');
}