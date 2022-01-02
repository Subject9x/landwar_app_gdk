/*
    Javascript layer for page: UnitBuilder
*/

const fs = require('fs')

fs.readFile('src/html/layout/navbar_default.html', (err, data) => {
    document.getElementById('tagNavBar').innerHTML = data;
})
document.getElementById('pageUnitBuild').setAttribute('hidden', 'true');