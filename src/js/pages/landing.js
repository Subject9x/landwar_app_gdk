/*
    Javascript layer for page: Landing
*/

const fs = require('fs')

function pageLandingIni(){

    fs.readFile('src/html/layout/navbar_default.html', (err, data) => {
        document.getElementById('tagNavBar').innerHTML = data;
    })
    document.getElementById('pageUnitBuild').setAttribute('hidden', 'true');
    
    document.getElementById('btnUnitBuilder').onclick = function(){
        document.getElementById('pageLanding').setAttribute('hidden', 'true');
        document.getElementById('pageUnitBuild').setAttribute('hidden', 'false');
    }
}
