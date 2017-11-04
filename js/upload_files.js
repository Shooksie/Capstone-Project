//const {remote} = require('electron')

//var remote = require('remote');
//const dialog = require('electron').remote;
var electron = require('electron');
var remote = require('electron').remote;
var fs = require('fs');

var tocompare = [];
document.getElementById('close').addEventListener('click',closeWindow);
document.getElementById('maximize').addEventListener('click',maximizeWindow);
document.getElementById('minimize').addEventListener('click',minimizeWindow);

document.getElementById('select-file1').addEventListener('click',function(){

  remote.dialog.showOpenDialog(function (fileNames) {
        console.log('click');
        dialogFunction(fileNames)
  });
}, false);

document.getElementById('select-file2').addEventListener('click',function(){
    remote.dialog.showOpenDialog(function (fileNames) {
        if(fileNames === undefined){
            console.log("No file selected");
        }else{
          var toAppend = document.getElementById("text-content-2")
          toAppend.innerHTML = ""
            readFile(fileNames[0], "2");
        }
    });
},false);
document.getElementById('save-changes').addEventListener('click',function(){
    var actualFilePath = document.getElementById("actual-file").value;

    if(actualFilePath){
        saveChanges(actualFilePath,document.getElementById('content-editor').value);
    }else{
        alert("Please select a file first");
    }
},false);

document.getElementById('delete-file').addEventListener('click',function(){
    var actualFilePath = document.getElementById("actual-file").value;

    if(actualFilePath){
        deleteFile(actualFilePath);
        actualFilePath.value = "";
        document.getElementById("content-editor").value = "";
    }else{
        alert("Please select a file first");
    }
},false);

//Uncaught TypeError: Cannot read property 'addEventListener' of null at upload_files.js:44
/*document.getElementById('create-new-file').addEventListener('click',function(){
    var content = document.getElementById("content-editor").value;

    dialog.showSaveDialog(function (fileName) {
        if (fileName === undefined){
            console.log("You didn't save the file");
            return;
        }

        fs.writeFile(fileName, content, function (err) {
            if(err){
                alert("An error ocurred creating the file "+ err.message)
            }

            alert("The file has been succesfully saved");
        });
    });
},false);*/

function dialogFunction(fileNames) {
  if(fileNames === undefined){
      console.log("No file selected");
  }else{
      console.log(fileNames[0].toString());
      readFile(fileNames[0]);
  }
}

function readFile(filepath, num="1") {
    fs.readFile(filepath, 'utf-8', function (err, data) {
        console.log(filepath);
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }
        values = data.split('\n')
        console.log(values);
        var toAppend = document.getElementById("text-content-"+ num)
        if( num === '1' ) {
          tocompare = values;
        }
        for ( var i = 0; i < values.length; i++ ) {
          if ( tocompare.length > 0 && num === '2' ) {
            if( values[i] === tocompare[i] ) {
              toAppend.innerHTML +=
                ("<div class='line-row-same'><div class='side-number'><p>"
                + i + "</p></div><div><p style='color: black; font-size: 17px;'>"
                + values[i] +"</p></div></div>")
            } else {
                toAppend.innerHTML +=
                  ("<div class='line-row-diff'><div style='border-right: 1px solid black;width: 50px;'><p style='color: black; font-size: 17px;'>"
                  + i + "</p></div><div><p style='color: black; font-size: 17px;'>"
                  + values[i] +"</p></div></div>")
              }
            }
          else {
            toAppend.innerHTML +=
              ("<div class='line-row'><div style='border-right: 1px solid black;width: 50px;'><p style='color: black; font-size: 17px;'>"
              + i + "</p></div><div><p style='color: black; font-size: 17px;'>"
              + values[i] +"</p></div></div>")
          }
        }
        //document.getElementById("content-editor"+ num).value = data;
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
                    console.log(err);
                    return;
                }
            });
        } else {
            alert("This file doesn't exist, cannot delete");
        }
    });
}

function saveChanges(filepath,content){
  console.log(content);
    fs.writeFile(filepath, content, function (err) {
        if(err){
            alert("An error ocurred updating the file"+ err.message);
            console.log(err);
            return;
        }

        alert("The file has been succesfully saved");
    });
}

function closeWindow(){
    var window = remote.getCurrentWindow();
    window.close();
}
function minimizeWindow(){
    var window = remote.getCurrentWindow();
    window.minimize();
}
function maximizeWindow(){
    var window = remote.getCurrentWindow();
    window.isMaximized() ? window.unmaximize() : window.maximize()
}
