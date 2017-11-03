//Module to control application life,Module to create native browser window.
const {app,BrowserWindow, ipcMain, webContents} = require('electron');
const path = require('path')
const url = require('url')
var firebase = require('firebase');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let loginWindow
let indexWindow
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on('ready', function(){
    createLogin();

    //container to store firebase data
    var data = {};
    var currentUser = null;

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyDID2ccJgGMUJB6ewxW1EwIE5zKUuw7Mgc",
      authDomain: "cs451-group6.firebaseapp.com",
      databaseURL: "https://cs451-group6.firebaseio.com",
      projectId: "cs451-group6",
      storageBucket: "cs451-group6.appspot.com",
      messagingSenderId: "631480008090"
    };
    firebase.initializeApp(config);

    var firebaseRef = firebase.database().ref("Users");

    firebaseRef.on("child_added", snap => {
        var image = snap.child("image").val();
        var username = snap.child("username").val();
        var trimmedName = username.substring(0,username.indexOf('@'))
        data[trimmedName] = {'image': image,'username':username};
    });

    //send firebase usernames to login page
    loginWindow.webContents.on('did-finish-load',function(){
        loginWindow.webContents.send('load_names', data);
    });

    //Catch username for authentication
    ipcMain.on('user_signin',function(e, username){
        firebase.auth().signInWithEmailAndPassword(username + "@cs451project.com","password").then(function(){
            createIndex();
            loginWindow.close();
            //send the user's info to index.js
            indexWindow.webContents.on('did-finish-load',function(){
                console.log(username);
                indexWindow.webContents.send('send_current_user', data[username]);
            });
        }).catch(function(error){
            if(error!=null){
                console.log(error.message);
            }
        });
    });
});







function createLogin () {  
    loginWindow = new BrowserWindow({width: 800, height: 600, frame:false})
    loginWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/login.html'),
        protocol: 'file:',
        slashes: true
    }));
    loginWindow.on('closed', function () {
        loginWindow = null
    });
}

function createIndex () {  
    indexWindow = new BrowserWindow({width: 800, height: 600, frame:false})
    indexWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file:',
        slashes: true
    }));
    indexWindow.on('closed', function () {
        indexWindow = null
    });
}




// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (loginWindow === null) {
    createLogin()
  }
});

