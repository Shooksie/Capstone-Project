const {remote, ipcRenderer} = require('electron');
window.$ = window.jQuery = require("jquery");
const firebase = require('firebase');

$.getScript('../js/frame.js');

$('#btnHome').on('click',function(e){
    e.preventDefault();
    ipcRenderer.send('nav_index');
});

// function source: https://gomakethings.com/how-to-get-the-value-of-a-querystring-with-native-javascript/
var getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
};

var reportName = getQueryString('reportName');

ipcRenderer.on('load_reports', function(event,reports){
    // populate reports in panels
    $('#report-container-left').append($('<div/>').append(reports[reportName]['left']));
    $('#report-container-right').append($('<div/>').append(reports[reportName]['right']));
});
