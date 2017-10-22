const {remote} = require('electron')
document.getElementById('close').addEventListener('click',closeWindow);
document.getElementById('maximize').addEventListener('click',maximizeWindow);
document.getElementById('minimize').addEventListener('click',minimizeWindow);
var panels = document.getElementsByClassName('panel');
for(var i = 0;i < panels.length; i++){
    panels[i].addEventListener('click',authenticate);
}
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
var i = 0;
firebaseRef.on("child_added", snap => {

    var image = snap.child("image").val();
    var username = snap.child("username").val();
    var trimmedName = username.substring(0,username.indexOf('@'));

    panels[i].children[0].children[0].src = "images/" + image;
    panels[i].children[1].innerText = trimmedName;
    i++;
});

function Signin(username) {
    firebase.auth().signInWithEmailAndPassword(username,"password").then(function(){
        document.location.href = "../index.html";
        alert("Signed in as: " + username);
    }).catch(function(error){
        if(error!=null){
            console.log(error.message);
            return;
        }
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

function authenticate() {
    var username = this.children[1].innerText + "@cs451project.com";
    Signin(username);
}
