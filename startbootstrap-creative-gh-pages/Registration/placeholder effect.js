$(function(){
    'use strict';
    $('.custom-input input[type = "text"]').on(focusout , function(){
        if($(this).val() != ""){
            $(this).parent().addClass('has-data');
        }
        else{
            $(this).parent().removeClass('has-data');
        }
    });
});



