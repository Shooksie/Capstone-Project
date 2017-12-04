const {remote, ipcRenderer} = require('electron');
window.$ = window.jQuery = require("jquery");

$.getScript('../js/frame.js');

$('#btnCompare').on('click',function(e){
    e.preventDefault();
    ipcRenderer.send('nav_upload');
});

$('#btnreport').on('click',function(e){
    e.preventDefault();
    ipcRenderer.send('nav_report');
});

ipcRenderer.on('send_current_user', function(event,user){
    var username = user['username'];
    $('#user-header').text("Dashboard - " + username.substring(0,username.indexOf('@')));
});