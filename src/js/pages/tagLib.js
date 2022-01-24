/*
    Page: TAG Library page
*/

let loadedTable = false;

function tl_buildTable(){
    if(loadedTable){
        return;
    }
    
    let tagTable = document.getElementById('tagLib_list').getElementsByTagName('tbody')[0];

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
    let tagViewModal = document.getElementById('tagLibModal');
    
    tagViewModal.innerHTML = '';
    tagViewModal.removeAttribute('hidden');
    tagViewModal.innerHTML = window.nodeFileSys.loadHTML('layout/pages/tagLibrary/tagLibView.html');
   
    document.getElementById('tagView').style.display = 'block';
    
    document.getElementById('tagViewClose').addEventListener('click', ()=>{
        document.getElementById('tagLibModal').setAttribute('hidden', 'true');
        document.getElementById('tagView').style.display = 'none';
        document.getElementById('tagLibModal').innerHTML = '';
    });

    let tagData = tagInfo.data[tagId];

    document.getElementById('tagWindow_descTitle').innerHTML = '<h4>'+ tagData.title + '</h4>';
    document.getElementById('tagWindow_descText').innerHTML = tagData.desc;
    document.getElementById('tagWindow_equation').innerHTML = tagData.eqt;
    document.getElementById('tagWindow_descWarn').innerHTML = tagData.reqs('blank');
}