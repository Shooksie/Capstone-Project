//Module to control application life,Module to create native browser window.
const {app,BrowserWindow, ipcMain, webContents,remote,EventEmitter} = require('electron');
const path = require('path');
const url = require('url');
var firebase = require('firebase');

let win;

//container to store firebase data
var data = {};

app.on('ready', function(){
    win = new BrowserWindow({width: 800, height: 600, frame:false});
    initFirebase(); 
    initLogin();
});

//Catch username for authentication 
ipcMain.on('user_signin',function(e, username){
    firebase.auth().signInWithEmailAndPassword(username + "@cs451project.com","password").then(function(){
        //init the index window and send the user's info to index.js
        initIndex(username);
    }).catch(function(error){
        if(error!=null){
            console.log(error.message);
        }
    });
});
//Logged in user signs out from firebase
ipcMain.on('user_signout',function(){
    firebase.auth().signOut().then(function() {       
        initLogin();
    }).catch(function(error) {
        console.log('Sign out unsuccesful');
    });
});


function initLogin() {

    win.setTitle('Login');
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'views/login.html'),
        protocol: 'file:',
        slashes: true
    }));
    //send firebase usernames to login page
    win.webContents.on('did-finish-load',function(){
        win.webContents.send('load_names', data);
    });
    win.on('closed', function () {
        win = null
    });
}

function initIndex(username) {
    win.setTitle('Dashboard - ' + username);
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    //sending username to index.js
    win.webContents.on('did-finish-load',function(){
        win.webContents.send('send_current_user', data[username]);
    });
    win.on('closed', function () {
        win = null
    });
}

// Initialize Firebase
function initFirebase(){
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
        var trimmedName = username.substring(0,username.indexOf('@'));
        data[trimmedName] = {'image': image,'username':username};
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
  if (win === null) {
    initLogin()
  }
});

