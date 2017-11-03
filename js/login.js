const {remote, ipcRenderer} = require('electron');
window.$ = window.jQuery = require("jquery");

$.getScript('../js/frame.js');

ipcRenderer.on('load_names', function(event,data){
    //Take the firebase data and generate login panels dynamicaly
    for (var u in data) {
        item = data[u];
        $('#user_panels').append($('<div/>').addClass('panel')
            .append($('<div/>').addClass('user_image')
                .append($('<img/>').attr('src','../images/' + data[u]['image'])))
            .append($('<div/>').addClass('username').text(u)));
    }

    //When a user is clicked, send it to main for authentication
    $('.panel').click(function(e){
        e.preventDefault();
        const usernameClicked = $(this).children('.username').text();
        ipcRenderer.send('user_signin', usernameClicked + "@cs451project.com");
    });
});

