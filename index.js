const {
    app,
    BrowserWindow,
    dialog,
    ipcMain
} = require('electron');

const fs = require("fs");
const url = require('url');
const os = require('os');
const path = require('path');
var UserSettings = require('./settings.js');
var StreamZip = require('node-stream-zip');

let win;
var settings = new UserSettings();

Array.prototype.last = function () {
    return this[this.length - 1];
}

const fileTypes = ['png', 'jpg', 'gif', 'bmp', 'jpeg', 'tiff'];
const comicTypes = ['cbz','cb7']; //['cbr','cb7']; will eventually support all three

ipcMain.on('get-info', function (event, arg) {
    var path = arg;
    fs.readdir(new url.URL("file:///" + path + '/'), function (err, files) {
        if (err) {
            return console.error(err);
        }

        files.sort();
        files.forEach(function (file) {
            if (!fs.statSync(new url.URL("file:///" + path + '/' + file)).isDirectory()) {
                if (comicTypes.includes(file.split('.').last())) {
                    var comic = {
                        filename: file.replace("." + file.split('.').last(), ""),
                        directory: path + '/',
                        type: file.split('.').last(),
                        read: true,
                        rtol: false
                    };
                    var zip = new StreamZip({
                        file: new url.URL("file:///" + comic.directory + comic.filename + "." + comic.type),
                        storeEntries: true
                    });
                    zip.on('error', err => {
                        console.error(err)
                    });
                    zip.on('ready', function () {
                        var i = 0;
                        while (i < Object.values(zip.entries()).length && Object.values(zip.entries())[i].name.split('.').last() !== 'json') {
                            var entry = Object.values(zip.entries())[i];
                            ++i;
                        }
                        i = (i === Object.values(zip.entries()).length) ? i - 1 : i;
                        if (Object.values(zip.entries())[i].name.split('.').last() === 'json') {
                            var info = JSON.parse(zip.entryDataSync(Object.values(zip.entries())[i]));
                            Object.assign(comic, info);
                            if (comic.title === "") {
                                comic.title = comic.series + " #" + comic.number;
                            }
                        } else {
                            comic.title = comic.filename;
                        }
                        //console.log(comic)
                        zip.close();
                        event.sender.send('push-book', comic);
                    });
                }
            }
        });
    });

});

ipcMain.on('get-thumb', function (event, arg) {
    var comic = arg;
    var zip = new StreamZip({
        file: new url.URL("file:///" + comic.directory + comic.filename + "." + comic.type),
        storeEntries: true
    });

    zip.on('ready', function (err) {
        if (err) {
            console.error(err);
            return;
        }
        var i = 0;
        var entry = Object.values(zip.entries())[i];
        while (!fileTypes.includes(entry.name.split('.').last() ||
                entry.isDirectory)) {
            i = i + 1;
            entry = Object.values(zip.entries())[i];
        }
        var data = zip.entryDataSync(entry.name);
        comic.loading = false;
        zip.close();
        event.sender.send('display-thumb', {
            book: comic,
            thumb: data
        });
    });
});

ipcMain.on('load-pages',function(event,arg){
    var book = arg;
    var zip = new StreamZip({
        file: new url.URL("file:///" + book.directory + book.filename + "." + book.type),
        storeEntries: true
    });
    zip.on('entry',entry=>{
        if(!entry.isDirectory){
            if (fileTypes.includes(entry.name.split('.').last())) {
                var data = zip.entryDataSync(entry.name);
                event.sender.send('push-page',data);
            }
        }
    });
});

var createWindow = function () {
    win = new BrowserWindow({
        width: settings.settings.bounds && settings.settings.bounds.width || 1280,
        height: settings.settings.bounds && settings.settings.bounds.height || 720,
        x: settings.settings.bounds && settings.settings.bounds.x || undefined,
        y: settings.settings.bounds && settings.settings.bounds.y || undefined,
        frame: false,
        minHeight: 720,
        minWidth: 1280,
        show: false,
        useContentSize: true,
        webPreferences: {
            javascript: true,
            nodeIntegration: true
        }
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'app/index.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.on('closed', () => {
        settings.save();
        win = null;
    });
    win.on('ready-to-show', function () {
        if (settings.settings.maximised) {
            win.maximize();
        }
        win.show();
        win.focus();
    });
    win.on('move', function () {
        settings.settings.maximised = win.isMaximized();
        if (!win.isMaximized()) {
            settings.settings.bounds = win.getBounds();
        }
    })
    win.on('resize', function () {
        settings.settings.maximised = win.isMaximized();
        if (!win.isMaximized()) {
            settings.settings.bounds = win.getBounds();
        }
    })
    win.webContents.on('crashed', function () {
        win.close();
    });
    /*win.on('unresponsive', function () {        
        dialog.showErrorBox({message:"An Error Occured"});
    })*/
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