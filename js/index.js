const {remote, ipcRenderer} = require('electron');
window.$ = window.jQuery = require("jquery");

$.getScript('../js/frame.js');

//Recieving the authenticated user from main.js
ipcRenderer.on('send_current_user', function(event,user){
    $('.logged_user_image').children('img').attr('src','../images/' + user['image']);
});