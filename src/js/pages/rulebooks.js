/*
    RULEBOOK PAGE FUNCTIONS
*/

function rb_rules_open_core(){
    window.api.send('rb-open-rules-core');
}

function rb_rules_pdf_core(){
    window.api.send('rb-save-rules-core', dialogSavePDFOptions, pdfSaveOptions);
}