const {remote, ipcRenderer} = require('electron');
const firebase = require('firebase');
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

ipcRenderer.on('load_reports', function(event,reports){
    // display links to the previous reports and send the selected report name to the reports view as a query string
    for (var r in reports) {
        $('#reports-list').append($('<div/>').addClass('reports')
            .append($('<div/>').addClass('report')
                .append($("<a href='reports.html?reportName=" + r + "'/>").text(reports[r]['reportName']))));
    }
});
