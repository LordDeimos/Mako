const {app, BrowserWindow} = require('electron')

const fs = require("fs");
const url = require('url');
const os = require('os');
const path = require('path');

var createWindow = function() {
    win=new BrowserWindow({width:1280, height:720,/*frame:false,*/minHeight:720,minWidth:1280})
    //win.setMenu(null);
    win.loadURL(url.format({pathname:path.join(__dirname,'index.html'),protocol:'file:',slashes:true}));
    win.on('closed', ()=>{win=null})    
}

app.on('ready', createWindow)

app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate',()=>{
    if(win===null){
        createWindow()
    }
})
