const {
    app,
    BrowserWindow
} = require('electron');

const fs = require("fs");
const url = require('url');
const os = require('os');
const path = require('path');
var UserSettings = require('./settings.js');

let win;
var settings = new UserSettings('settings.json');

var createWindow = function () {
    win = new BrowserWindow({
        width: settings.settings.bounds && settings.settings.bounds.width||1280,
        height: settings.settings.bounds && settings.settings.bounds.height||720,
        x: settings.settings.bounds && settings.settings.bounds.x||undefined,
        y: settings.settings.bounds && settings.settings.bounds.y||undefined,
        frame: false,
        minHeight: 720,
        minWidth: 1280,
        show: false
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.on('closed', () => {
        settings.save();
        win = null;
    });
    win.on('ready-to-show', function () {
        if(settings.settings.maximised){
            win.maximize();
        }
        win.show();
        win.focus();
    });
    win.on('move',function(){        
        settings.settings.maximised = win.isMaximized();
        if(!win.isMaximized()){            
            settings.settings.bounds = win.getBounds();
        }
    })
    win.on('resize',function(){
        settings.settings.maximised = win.isMaximized();
        if(!win.isMaximized()){
            settings.settings.bounds = win.getBounds();
        }
    })
    win.webContents.on('crashed', function () {
        win.close();
    });
    win.on('unresponsive', function () {        
        dialog.showErrorBox({message:"An Error Occured"});
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});
