const {remote, ipcRenderer} = require('electron');
window.$ = window.jQuery = require("jquery");

$.getScript('../js/frame.js');

ipcRenderer.on('send_current_user', function(event,data){
    console.log(data);
});