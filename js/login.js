const {remote, ipcRenderer} = require('electron');
window.$ = window.jQuery = require("jquery");

ipcRenderer.on('load_names', function(event,data){
    for (var u in data) {
        item = data[u];
        $('#user_panels').append($('<div/>').addClass('panel')
            .append($('<div/>').addClass('user_image')
                .append($('<img/>').attr('src','../images/' + data[u]['image'])))
            .append($('<div/>').addClass('username').text(u)));
    }
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

$('#user_panels').children().each(function(){
    $(this).click(function(){
        Signin($(this).children('.username').text() + "@cs451project.com");
    });
});

/*// Initialize Firebase
var config = {
    apiKey: "AIzaSyDID2ccJgGMUJB6ewxW1EwIE5zKUuw7Mgc",
    authDomain: "cs451-group6.firebaseapp.com",
    databaseURL: "https://cs451-group6.firebaseio.com",
    projectId: "cs451-group6",
    storageBucket: "cs451-group6.appspot.com",
    messagingSenderId: "631480008090"
};
firebase.initializeApp(config);

//Import user data from firebase
var firebaseRef = firebase.database().ref("Users");
var i = 0;
//Event to display firebase data in html
//This event runs after the DOM has loaded
firebaseRef.on("child_added", snap => {

    var image = snap.child("image").val();
    var username = snap.child("username").val();
    var trimmedName = username.substring(0,username.indexOf('@'));

    $('#user_panels').children().eq(i).find('img').attr('src','../images/' + image);
    $('#user_panels').children().eq(i).find('.username').text(trimmedName);
    i++;
});*/


