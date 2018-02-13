const remote = require('electron').remote;
var dialog = remote.dialog;
var process = remote.process;
var ipcRenderer = require('electron').ipcRenderer;

var os = require('os');
var fs = require("fs");
var url = require('url');
var path = require('path');
const ArchiveManager = require('archive-manager');

var bookList = [];
const comicTypes = ['cbz', 'cb7']; //['cbr','cb7']; will eventually support all three
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
    currentBook.rtol = book.rtol;

    var file = book.directory + book.filename + "." + book.type;
    ArchiveManager.ListContent(file).forEach(function (entry) {
        if (!ArchiveManager.GetInfo(entry, file).directory) {
            if (fileTypes.includes(entry.split('.').last())) {
                var data = ArchiveManager.ReadBuffer(entry, file);
                event.sender.send('push-page', data);
            }
        }
    });
};

ipcRenderer.on('push-page', function (event, arg) {
    currentBook.pages.push("data:image/jpg;base64," + arg.toString('base64'));
    //currentBook.pages.push('resources/icon.png');
    if (currentBook.totalPages === 0) {
        $('#pages>figure>img').attr('src', currentBook.pages[currentBook.currentPage]);
    }
    ++currentBook.totalPages;
    console.log("Adding Page " + currentBook.totalPages);
})

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