const {app,BrowserWindow,dialog} = require('electron');

const fs = require("fs");
const url = require('url');
const os = require('os');
const path = require('path');
var set = require('./settings.js');

let win;

var createWindow = function(){
    //scan the saved settings
    win=new BrowserWindow({width:1280, height:720,frame:false,minHeight:720,minWidth:1280,show:false});
    //win.setMenu(null);
    win.loadURL(url.format({pathname:path.join(__dirname,'index.html'),protocol:'file:',slashes:true}));
    win.on('closed', ()=>{
        win=null;
    });
    win.on('ready-to-show',function(){
        win.show();
        win.focus();
    });
}

app.on('ready',createWindow);

app.on('window-all-closed',()=>{
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate',()=>{
    if(win===null){
        createWindow()
    }
});
