// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var app = require('electron').remote;
var dialog = app.dialog;

// Or with ECMAScript 6
const {dialog} = require('electron').remote;

dialog.showOpenDialog((fileNames) => {
    // fileNames is an array that contains all the selected
    if(fileNames === undefined){
        console.log("No file selected");
        return;
    }

    fs.readFile(filepath, 'utf-8', (err, data) => {
        if(err){
            alert("An error ocurred reading the file :" + err.message);
            return;
        }

        // Change how to handle the file content
        console.log("The file content is : " + data);
    });
});


// Note that the previous example will handle only 1 file, if you want that the dialog accepts multiple files, then change the settings:
// And obviously , loop through the fileNames and read every file manually
dialog.showOpenDialog({
    properties: [
        'openFile', 'multiSelections', (fileNames) => {
            console.log(fileNames);
        }
    ]
});
