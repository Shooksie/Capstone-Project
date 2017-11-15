//Module to control application life,Module to create native browser window.
const {app,BrowserWindow, ipcMain, webContents,remote,EventEmitter} = require('electron');
const path = require('path');
const url = require('url');
const firebase = require('firebase');

let win;

//container to store firebase data
var data = {};

app.on('ready', function(){

    var currentUser = null;

    initFirebase();
    initWindow();

    //Fires after a url is loaded into win
    win.webContents.on('did-finish-load',function(){
        if(currentUser != null){
            win.webContents.send('send_current_user', data[currentUser]);
        }
        else{
            win.webContents.send('load_names', data);
        }
    });

    win.on('closed', function () {
        app.quit();
    });

    //Recieving username from login.js to authenticate to firebase
    //Sending username to index.html
    ipcMain.on('user_signin',function(e, username){
        currentUser = username;
        firebase.auth().signInWithEmailAndPassword(currentUser + "@cs451project.com","password").then(function(){
            win.loadURL(url.format({ pathname: path.join(__dirname, 'views/index.html'), protocol: 'file:',slashes: true})); 
            win.setTitle('Dashboard - ' + currentUser);     
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
            win.loadURL(url.format({ pathname: path.join(__dirname, 'views/login.html'), protocol: 'file:',slashes: true}));
            win.setTitle('Login');
        }).catch(function(error) {
            console.log('Sign out unsuccesful');
        });
    });

    //Receiving signal from index.js to navigate to upload_files.html
    ipcMain.on('nav_upload',function(){
        win.loadURL(url.format({ pathname: path.join(__dirname, 'views/upload_files.html'), protocol: 'file:',slashes: true}));
        win.setTitle('Upload - ' + currentUser);
    });

    //Receiving signal from index.js to navigate to report_mockup.html
    ipcMain.on('nav_report',function(){
        win.loadURL(url.format({ pathname: path.join(__dirname, 'views/report_mockup.html'), protocol: 'file:',slashes: true}));
        win.setTitle('Reports - ' + currentUser);
    });
    //Receiving signal from either upload_files.js or report_mockup.js to navigate back to index.html
    ipcMain.on('nav_index',function(){
        win.loadURL(url.format({ pathname: path.join(__dirname, 'views/index.html'), protocol: 'file:',slashes: true}));
        win.setTitle('Dashboard - ' + currentUser);
    });

});

function initWindow() {
    win = new BrowserWindow({width: 800, height: 600, title: 'Login', show: true, frame : false})
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'views/login.html'),
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
  if (win === null) {
    initLogin()
  }
});
