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
    let celCount = 4;
    let tagRow;
   
    for(let tagId in tagInfo.data){
        let tagItem = tagInfo.data[tagId];
        if(celCount == 4){
            tagRow = tagTable.insertRow();
            celCount = 0;
        }
        let cel = document.createElement('td');
        cel.innerHTML = window.nodeFileSys.loadHTML('layout/pages/tagLibrary/tagTableItem.html');
        cel.children[0].innerHTML = tagItem.title
        cel.children[0].id = tagCount;
        cel.children[0].addEventListener('click', (e)=>{tl_showTag(e, cel.children[0].id);});
        tagRow.appendChild(cel) ;
        celCount++;
        tagCount++;
    }
}


function tl_showTag(event, celData){
    console.log(celData);
    event.preventDefault();
}