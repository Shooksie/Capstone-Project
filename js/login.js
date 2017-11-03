const {remote, ipcRenderer} = require('electron');
window.$ = window.jQuery = require("jquery");

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
