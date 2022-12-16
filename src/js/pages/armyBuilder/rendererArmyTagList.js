api.handle( 'ab-taglist-load-response', (event, data) => function(event, data){

    let printTagList = JSON.parse(data);

    let tagListRow = $("#tagListRows")[0];
    let tagLibHtml =  window.nodeFileSys.loadHTML("layout/pages/tagLibrary/tagLibViewList.html");;

    for(let tagIndex in printTagList){
        let tagId = printTagList[tagIndex];
        let tagItem = tagInfo.data[tagId];
    
        
        let newRowDiv = tagListRow.appendChild(document.createElement('div'));
        newRowDiv.id = "tagRow" + tagIndex;
        newRowDiv.className += 'grd-row';

        let span = newRowDiv.appendChild(document.createElement('div'));
        span.className += 'grd-row-col-1-6--sm grd-row-col-1-6--md grd-row-col-1-6--lg';

        let viewDiv = newRowDiv.appendChild(document.createElement('div'));
        viewDiv.id = newRowDiv.id + "_viewDiv";
        viewDiv.className += 'grd-row-col-4-6--sm grd-row-col-4-6--md grd-row-col-4-6--lg';
        viewDiv.innerHTML = tagLibHtml;
        viewDiv.querySelector("#tagWindow_descTitle").innerHTML =  '<b>'+ tagItem.title + '</b>';
        viewDiv.querySelector("#tagWindow_descText").innerHTML =  tagItem.desc;
        let tagViewDiv = viewDiv.querySelector('#tagView');
        tagViewDiv.removeChild(tagViewDiv.children[0]);
        tagViewDiv.id ="";
    }
    $("#tagViewClose").remove();

}, event);