//Module to control application life,Module to create native browser window.
const {app,BrowserWindow, ipcMain, webContents,remote,EventEmitter} = require('electron');
const path = require('path');
const url = require('url');
var firebase = require('firebase');

let loginWin;
let indexWin;

//container to store firebase data
var data = {};

app.on('ready', function(){

    var currentUser = null;

    initFirebase(); 
    initLogin();
    initIndex();

    //sending firebase usernames to login.js
    loginWin.webContents.on('did-finish-load',function(){
        loginWin.webContents.send('load_names', data);
    });
    loginWin.on('closed', function () {
        app.quit();
    });

    
    indexWin.on('closed', function () {
        app.quit();
    });
    //Recieving username from login.js to authenticate to firebase
    ipcMain.on('user_signin',function(e, username){
        currentUser = username;
        firebase.auth().signInWithEmailAndPassword(currentUser + "@cs451project.com","password").then(function(){
            loginWin.hide();
            indexWin.webContents.send('send_current_user', data[currentUser]);
            indexWin.setTitle('Dashboard - ' + currentUser);
            indexWin.show();
        }).catch(function(error){
            if(error!=null){
                console.log(error.message);
            }
        });
    });

    //Recieving signal from index.js to sign out from firebase
    ipcMain.on('user_signout',function(){
        firebase.auth().signOut().then(function() {
            currentUser = null;       
            indexWin.hide();
            loginWin.show();
        }).catch(function(error) {
            console.log('Sign out unsuccesful');
        });
    });
});

function initLogin() {
    loginWin = new BrowserWindow({width: 800, height: 600, title: 'Login', show: true, frame : false})
    loginWin.setTitle('Login');
    loginWin.loadURL(url.format({
        pathname: path.join(__dirname, 'views/login.html'),
        protocol: 'file:',
        slashes: true
    }));   
}

function initIndex() {
    indexWin = new BrowserWindow({width: 800, height: 600, show: false, frame : false})
    indexWin.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file:',
        slashes: true
    }));
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
  //if (process.platform !== 'darwin') {
    app.quit()
  //}
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (loginWin === null) {
    initLogin()
  }
});

