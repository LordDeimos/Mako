const remote = require('electron').remote;
var dialog = remote.dialog;
var process = remote.process;

var StreamZip = require('node-stream-zip');
var os = require('os');
var fs = require("fs");
var url = require('url');
var path = require('path');

var bookList = [];
const comicTypes = ['cbz','cb7']; //['cbr','cb7']; will eventually support all three
const fileTypes = ['png', 'jpg', 'gif', 'bmp', 'jpeg', 'tiff'];
var totalPages = 0;

Array.prototype.last = function () {
    return this[this.length - 1];
}

var pageDisplay = false;
var dummy = false;

var currentBook = {};

var loadBook = function (book) {
    console.log("Closing old book");
    closeBook();
    reader.reading = true;
    totalPages = 0;
    console.log("Loading " + book.title);
    var zip = new StreamZip({
        file: new url.URL("file:///" + book.directory + book.filename + "." + book.type),
        storeEntries: true
    });
    currentBook.rtol = book.rtol;
    zip.on('entry',entry=>{
        if(!entry.isDirectory){
            if (fileTypes.includes(entry.name.split('.').last())) {
                var data = zip.entryDataSync(entry.name);
                currentBook.pages.push("data:image/jpg;base64,"+data.toString('base64'));
                if(currentBook.totalPages===0){                    
                    $('#pages>figure>img').attr('src',currentBook.pages[currentBook.currentPage]);
                }
                ++currentBook.totalPages;
            }
        }
    })
    var i = 0;
    /*zip.on('ready', function () {
        return new Promise((resolve,reject)=>{            
            Object.values(zip.entries()).forEach(function (entry) {
                if (!entry.isDirectory) {
                    if (fileTypes.includes(entry.name.split('.')[entry.name.split('.').length - 1])) {
                        //var data = zip.entryDataSync(entry.name); //this is bad, try for async
                        zip.stream(entry.name, (err, stm)=>{
                            stm.pipe(process.stdout);
                            //currentBook.pages.push("data:image/jpg;base64,"+data.toString('base64'));    
                        });   
                        i = i + 1;
                    }
                }
            });
            //$('#pages>figure>img').attr('src',currentBook.pages[currentBook.currentPage]);
            totalPages = i;
            zip.close();
            resolve("Finished loading book");
        });
    });*/
};

var pageCounter = 1;
var animating = false;
var left = function () {
    if (animating) {
        return;
    }
    var turn = (!currentBook.rtol)?currentBook.currentPage!==1:currentBook.currentPage!==currentBook.totalPages-1;
    if (turn) {
        animating = true;
        $('#pages>figure>img').fadeOut(function(){            
            currentBook.currentPage = (currentBook.rtol)?currentBook.currentPage+1:currentBook.currentPage-1;
            $('#pages>figure>img').attr('src',currentBook.pages[currentBook.currentPage]);
            $('#pages>figure>img').fadeIn(function(){
                animating = false;
            })
        })
    }
};

var right = function () {
    if (animating) {
        return;
    }
    var turn = (currentBook.rtol)?currentBook.currentPage!==1:currentBook.currentPage!==currentBook.totalPages-1;
    if (turn) {
        animating = true;
        $('#pages>figure>img').fadeOut(function(){            
            currentBook.currentPage = (currentBook.rtol)?currentBook.currentPage-1:currentBook.currentPage+1;
            $('#pages>figure>img').attr('src',currentBook.pages[currentBook.currentPage]);
            $('#pages>figure>img').fadeIn(function(){
                animating = false;
            })
        })

    }
};

var arrangePages = function () {
    pageDisplay = document.getElementById('pageno').checked;
    animating = true;
    switch (pageDisplay) {
        case true:
            $(`#${pageCounter+1}`).fadeIn(function () {
                animating = false;
            });
            if (dummy) {
                totalPages = totalPages + 1;
            }
            break;
        case false:
            $(`#${pageCounter+1}`).fadeOut(function () {
                animating = false;
            });
            if (dummy) {
                totalPages = totalPages - 1;
            }
            break;
    }
};

var closeBook = function () {
    //Dispose of all td child elements of the tr called pages
    currentBook = {
        pages:[],
        currentPage:0,
        totalPages:0,
        rtol:false
    };
    reader.reading=false;
};