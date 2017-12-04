//const {remote} = require('electron')

//var remote = require('remote');
//const dialog = require('electron').remote;
const ipcRenderer = require('electron').ipcRenderer;
window.$ = window.jQuery = require("jquery");
$.getScript('../js/frame.js');

var electron = require('electron');
var remote = require('electron').remote;
var fs = require('fs');

var tocompare = [];
var firstRender = '';

function dialogFunction(fileNames) {
  if(fileNames === undefined){
      console.log("No file selected");
  }else{
      readFile(fileNames[0]);
  }
}

function readFile(filepath, num="1") {
    fs.readFile(filepath, 'utf-8', function (err, data) {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        values = data.split('\n');
        sameLines = [];
        diffLines = [];
        var toAppend = document.getElementById("text-content-"+ num);
        if( num === '1' ) {
          tocompare = values;
        }
        for ( var i = 0; i < values.length; i++ ) {
          var found = false;
          if ( tocompare.length > 0 && num === '2' ) {
            for ( var z=0; z < tocompare.length; z++ ) {
              if ( values[i] === tocompare[z] && !found &&values[i].length !== 0) {
                sameLines.push(z);
                found = true
                toAppend.innerHTML +=
                ("<div class='line-row-same'>" +
                  "<div class='side-number'>" +
                    "<p>"+ i + "</p>" +
                  "</div>" +
                  "<div>"+
                    "<p class='text-styling'>"+ values[i] + ' //line: '+ z +"</p>" +
                  "</div></div>")
              }
            }
            if ( values[i].length !== 0 && !found ) {
                  found = true;
                  toAppend.innerHTML +=
                  ("<div class='line-row-diff'>" +
                    "<div class='side-number'>" +
                      "<p>"+ i + "</p>" +
                    "</div>" +
                    "<div>" +
                      "<p class='text-styling'>"+ values[i] + "</p>" +
                    "</div></div>")
                }
             else if ( !found) {
               found = true
               toAppend.innerHTML += ("<div class='line-row'>" +
                   "<div class='side-number'>" +
                     "<p>"+ i + "</p>" +
                   "</div>" +
                   "<div>"+
                     "<p class='text-styling'>"+ values[i] +"</p>" +
                   "</div></div>");
               }
            } else {
              toAppend.innerHTML += ("<div class='line-row'>" +
                  "<div class='side-number'>" +
                    "<p>"+ i + "</p>" +
                  "</div>" +
                  "<div>"+
                    "<p class='text-styling'>"+ values[i] +"</p>" +
                  "</div></div>");
          }
        }
        //document.getElementById("content-editor"+ num).value = data;
        //TODO: split the bottom code into a sperate function
        if ( num === '2') {
          //rerending the text-content-1 with all the similarties
          var toAppend = document.getElementById("text-content-1");
          toAppend.innerHTML = '';
          for ( var i = 0; i < tocompare.length; i++) {
            if ( sameLines.includes(i) ) {
              toAppend.innerHTML +=
              ("<div class='line-row-same'>" +
                "<div class='side-number'>" +
                  "<p>"+ i + "</p>" +
                "</div>" +
                "<div>"+
                  "<p class='text-styling'>"+ tocompare[i] +"</p>" +
                "</div></div>")
            } else {
              toAppend.innerHTML += ("<div class='line-row'>" +
                  "<div class='side-number'>" +
                    "<p>"+ i + "</p>" +
                  "</div>" +
                  "<div>"+
                    "<p class='text-styling'>"+ tocompare[i] +"</p>" +
                  "</div></div>");
            }
          }
        }
        filename = filepath.split('/')
        document.getElementById("file-name-"+ num).innerHTML = filename[filename.length - 1];
    });
}

function deleteFile(filepath){
    fs.exists(filepath, function(exists) {
        if(exists) {
            // File exists deletings
            fs.unlink(filepath,function(err){
                if(err){
                    alert("An error ocurred updating the file"+ err.message);
                    return;
                }
            });
        } else {
            alert("This file doesn't exist, cannot delete");
        }
    });
}

function saveChanges(filepath,content){
    fs.writeFile(filepath, content, function (err) {
        if(err){
            alert("An error ocurred updating the file"+ err.message);
            return;
        }

        alert("The file has been succesfully saved");
    });
}

document.getElementById('select-file1').addEventListener('click',function(){

  remote.dialog.showOpenDialog(function (fileNames) {
        var toAppend = document.getElementById("text-content-1");
        toAppend.innerHTML = "";
        var toAppend = document.getElementById("text-content-2");
        toAppend.innerHTML = "";
        dialogFunction(fileNames);
    });
}, false);

document.getElementById('select-file2').addEventListener('click', function(){
    var toAppend = document.getElementById("text-content-2");

    remote.dialog.showOpenDialog(function (fileNames) {
        if(fileNames === undefined){
            console.log("No file selected");
        } else{
            toAppend.innerHTML = "";
            readFile(fileNames[0], "2");
        }
    });
},false);

document.getElementById('save-changes').addEventListener('click', function(){
    var actualFilePath = document.getElementById("actual-file").value;

    if(actualFilePath){
        saveChanges(actualFilePath,document.getElementById('content-editor').value);
    }else{
        alert("Please select a file first");
    }
},false);

document.getElementById('delete-file').addEventListener('click', function(){
    var actualFilePath = document.getElementById("actual-file").value;

    if(actualFilePath) {
        deleteFile(actualFilePath);
        actualFilePath.value = "";
        document.getElementById("content-editor").value = "";
    }else{
        alert("Please select a file first");
    }
},false);

$('#btnHome').on('click',function(e){
    e.preventDefault();
    ipcRenderer.send('nav_index');
});
