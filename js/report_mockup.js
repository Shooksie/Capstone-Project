const {remote, ipcRenderer} = require('electron');
window.$ = window.jQuery = require("jquery");

$.getScript('../js/frame.js');

$('#btnHome').on('click',function(e){
    e.preventDefault();
    ipcRenderer.send('nav_index');
});