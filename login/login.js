const {BrowserWindow, app, globalShortcut} = require('electron');
const url = require('url');

let win = null

function boot(){
    win = new BrowserWindow({
      width: 1000,
      height: 1000,
      frame: false
    })

    win.loadURL(`file://${__dirname}/login.html`)
    win.on('closed',() => {
        win = null
    })
}



app.on('ready',boot);

//C:/Users/James/Desktop/Jimmy/CS451/cs451-standard-project/login
