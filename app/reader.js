const remote = require('electron').remote;
var dialog = remote.dialog;
var process = remote.process;
var ipcRenderer = require('electron').ipcRenderer; 

var StreamZip = require('node-stream-zip');
var os = require('os');
var fs = require("fs");
var url = require('url');
var path = require('path');

var bookList = [];
const comicTypes = ['cbz','cb7']; //['cbr','cb7']; will eventually support all three
const fileTypes = ['png', 'jpg', 'gif', 'bmp', 'jpeg', 'tiff'];
var totalPages = 0;

/**
 * @function last
 * @description Getter for the last array element
 * @returns Last Element in the Array
 */
Array.prototype.last = function () {
    return this[this.length - 1];
}

var pageDisplay = false;
var dummy = false;

var currentBook = {};

/**
 * @function loadBook
 * @param {*Object} book - The comic to be loaded
 * @description Loades the book specified by book into the reader
 */
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
var animating = false;

/**
 * @function left
 * @description Navigates the reader left a page
 */
var left = function () {
    if (animating) {
        return;
    }
    var turn = (!currentBook.rtol)?currentBook.currentPage!==0:currentBook.currentPage!==currentBook.totalPages-1;
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

/**
 * @function right
 * @description Navigate the reader right a page
 */
var right = function () {
    if (animating) {
        return;
    }
    var turn = (currentBook.rtol)?currentBook.currentPage!==0:currentBook.currentPage!==currentBook.totalPages-1;
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

/**
 * @function closeBook
 * @description Resets the temporary book container and updates vue
 */
var closeBook = function () {
    currentBook = {
        pages:[],
        currentPage:0,
        totalPages:0,
        rtol:false
    };
    reader.reading=false;
};