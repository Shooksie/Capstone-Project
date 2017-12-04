const {ipcRenderer,remote} = require('electron');
window.$ = window.jQuery = require("jquery");

$.getScript('../js/frame.js');

//Recieving firebase data from main.js
ipcRenderer.on('load_names', function(event,data){
    //Take the firebase data and generate login panels dynamicaly  
    for (var u in data) {
        $('#user_panels').append($('<div/>').addClass('panel')
            .append($('<div/>').addClass('user_image')
                .append($('<img/>').attr('src','../images/' + data[u]['image'])))
            .append($('<div/>').addClass('username').text(u)));
    }
    
    //Sending username to main.js for authentication
    $('.panel').click(function(){
        var usernameClicked = $(this).children('.username').text();
        ipcRenderer.send('user_signin', usernameClicked);
    });
});


