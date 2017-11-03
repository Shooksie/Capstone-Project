window.$ = window.jQuery = require("jquery");

$(document).ready(function () {

    const icons = {'close':'&#x2716;','maximize':'&#x1f5d6;','minimize':'&#x1f5d5;'};
    //Load the icons for closing,maximizing and minimizing the window
    for (var i in icons){
        $('#frame').append($('<div/>').addClass('option').attr('id', i).html(icons[i]));
    }
    
    $('#close').click(function(){
        var window = remote.getCurrentWindow();
        window.close();
    });
    
    $('#maximize').click(function(){
        var window = remote.getCurrentWindow();
        if(window.isMaximized()){
          $('#maximize').html('&#x1f5d6;');
            window.unmaximize();
        }
        else{
            $('#maximize').html('&#x1F5D7;');
            window.maximize();
        }
    });
    
    $('#minimize').click(function(){
        var window = remote.getCurrentWindow();
        window.minimize();
    });
});