function changePE() {
    if($('#pe').val()>$('#pec').val()){
        $('#pe').val($('#pec').val());
    }
}

function changePEC() {
    if($('#pec').val()<$('#pe').val()){
        $('#pec').val($('#pe').val());
    }
}