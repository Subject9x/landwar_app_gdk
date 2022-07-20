/*
    Renderer.js component for Electron
*/
api.handle( 'ub-dialog-load-response', ( event, data ) => function( event, data ) {
    file_unitBuild_import(data);
}, event);
