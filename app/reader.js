const remote = require('electron').remote;
const shell = remote.shell;
var dialog = remote.dialog;
var process = remote.process;
var ipcRenderer = require('electron').ipcRenderer;

var os = require('os');
var fs = require("fs");
var url = require('url');
var path = require('path');
const ArchiveManager = require('archive-manager');

var bookList = [];
const comicTypes = ['cbz', 'cb7', 'cbt'];
const fileTypes = ['png', 'jpg', 'gif', 'bmp', 'jpeg', 'tiff'];
var totalPages = 0;

/**
 * @class WorkerQueue
 * @description Used because I found no way to view what was currently being done by archive-manager
 */
class WorkerQueue {
    constructor() {
        this.queue = [];
        this.values = [];
        this.processing = false;
    }

    addToQueue(f,data) {
        this.queue.push(f);
        this.values.push(data);
        if(this.processing===false){
            this.start();
        }
    };

    next() {
        if(this.processing===false){
            var f = this.queue.shift();
            var args = this.values.shift();
            if (typeof f === 'function') {
                this.processing=true;
                f(args);
            }
        }
    };

    remove() {
        this.processing=false;
        this.next();
    };

    start() {
        this.next();
    };
}

var pipeline = new WorkerQueue();
setInterval(()=>{
    console.log(pipeline.values);
},500);

/**
 * @function last
 * @description Getter for the last array element
 * @returns Last Element in the Array
 */
Array.prototype.last = function () {
    return this[this.length - 1];
}

function sortEntry(a, b) {
    var nameA = a.name.toLowerCase();
    var nameB = b.name.toLowerCase();
    if (nameA < nameB) {
        return -1;
    } else if (nameB < nameA) {
        return 1;
    }
    return 0;
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
    currentBook.rtol = book.rtol;
    currentBook.currentPage = 0;

    var file = book.directory + book.filename + "." + book.type;
    pipeline.addToQueue((file) => {
        ArchiveManager.Content(file, function (err, files) {
            var i = -1;
            files.sort(sortEntry).forEach(function (entry) {
                if (!entry.directory) {
                    if (fileTypes.includes(entry.name.split('.').last())) {
                        ++i;
                        pipeline.addToQueue((args) => {
                                ArchiveManager.Read(args.entry.name, args.file, function (err, data) {
                                    console.log(args.j);
                                    if (err) {
                                        console.error(err);
                                        return;
                                    }
                                    currentBook.pages[args.j] = "data:image/jpg;base64," + data.toString('base64');
                                    if (args.j === 0) {
                                        $('#pages>figure>img').attr('src', currentBook.pages[0]);
                                    }
                                    ++currentBook.totalPages;
                                    $('#pageCount').text((currentBook.currentPage + 1) + '/' + currentBook.totalPages);
                                    pipeline.remove();
                                });
                        },{
                            file:file,
                            j:i,
                            entry:entry
                        });
                    }
                }
            });
            pipeline.remove();
        });
    },file);
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
    var turn = (!currentBook.rtol) ? currentBook.currentPage !== 0 : currentBook.currentPage !== currentBook.totalPages - 1;
    if (turn) {
        animating = true;
        $('#pages>figure>img').fadeOut(function () {
            currentBook.currentPage = (currentBook.rtol) ? currentBook.currentPage + 1 : currentBook.currentPage - 1;
            $('#pages>figure>img').attr('src', currentBook.pages[currentBook.currentPage]);
            $('#pageCount').text((currentBook.currentPage + 1) + '/' + currentBook.totalPages);
            $('#pages>figure>img').fadeIn(function () {
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
    var turn = (currentBook.rtol) ? currentBook.currentPage !== 0 : currentBook.currentPage !== currentBook.totalPages - 1;
    if (turn) {
        animating = true;
        $('#pages>figure>img').fadeOut(function () {
            currentBook.currentPage = (currentBook.rtol) ? currentBook.currentPage - 1 : currentBook.currentPage + 1;
            $('#pages>figure>img').attr('src', currentBook.pages[currentBook.currentPage]);
            $('#pageCount').text((currentBook.currentPage + 1) + '/' + currentBook.totalPages);
            $('#pages>figure>img').fadeIn(function () {
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
        pages: [],
        currentPage: 0,
        totalPages: 0,
        rtol: false
    };
    reader.reading = false;
};