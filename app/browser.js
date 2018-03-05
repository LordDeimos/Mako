/**
 * @function clearExlorer
 * @description Resets the explorers list
 */
var clearExplorer = function () {
    books.bookList = [];
};

/**
 * @function sortBook
 * @description Custom sort algorithm for books
 * @param {*Object} a - The current object
 * @param {*Object} b - The object to compare it to
 */
var sortBookByTitle = function (a, b) {
    var titleA = a.title.toLowerCase();
    var titleB = b.title.toLowerCase();
    if (titleA < titleB) {
        return -1;
    } else if (titleB < titleA) {
        return 1;
    }
    return 0;
}

var sortBookByAuthor = function (a, b) {
    var A = (a.author === "") ? a.title.toLowerCase() : a.author.toLowerCase();
    var B = (b.author === "") ? b.title.toLowerCase() : b.author.toLowerCase();
    if (A < B) {
        return -1;
    } else if (B < A) {
        return 1;
    }
    return 0;
}

var sortBookByAuthor = function (a, b) {
    var A = (a.author === "") ? a.title.toLowerCase() : a.author.toLowerCase();
    var B = (b.author === "") ? b.title.toLowerCase() : b.author.toLowerCase();
    if (A < B) {
        return -1;
    } else if (B < A) {
        return 1;
    }
    return 0;
}

var sortBookBySeries = function (a, b) {
    var A = (a.series === "") ? a.title.toLowerCase() : a.series.toLowerCase();
    var B = (b.series === "") ? b.title.toLowerCase() : b.series.toLowerCase();
    if (A < B) {
        return -1;
    } else if (B < A) {
        return 1;
    }
    return 0;
}

var sortBookByFileName = function (a, b) {
    var A = (a.filename === "") ? a.title.toLowerCase() : a.filename.toLowerCase();
    var B = (b.filename === "") ? b.title.toLowerCase() : b.filename.toLowerCase();
    if (A < B) {
        return -1;
    } else if (B < A) {
        return 1;
    }
    return 0;
}

var sortBook = sortBookByTitle;

/**
 * @function loadDir
 * @description Scans the directory specified by openDirectory dialog into the explorer
 */
var loadDir = function () {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, function (filePaths) {
        if (filePaths === undefined) {
            return;
        }
        clearExplorer();
        var path = filePaths[0].replace(/\\/g, '/');

        fs.readdir(new url.URL("file:///" + path + '/'), function (err, files) {
            if (err) {
                return console.error(err);
            }

            files.sort();
            var i = -1;
            files.forEach(function (file) {
                if (!fs.statSync(new url.URL("file:///" + path + '/' + file)).isDirectory()) {
                    if (comicTypes.includes(file.split('.').last())) {
                        var comic = {
                            filename: file.replace("." + file.split('.').last(), ""),
                            directory: path + '/',
                            type: file.split('.').last(),
                            read: true,
                            rtol: false,
                            series: "",
                            number: -1,
                            title: "",
                            author: ""
                        };
                        //var file = new url.URL("file:///" + comic.directory + comic.filename + "." + comic.type);
                        pipeline.addToQueue((comic) => {
                            ArchiveManager.Read('info.json', comic.directory + comic.filename + "." + comic.type, function (err, data) {
                                var info = (data) ? JSON.parse(data) : {};
                                Object.assign(comic, info);
                                if (comic.title === "") {
                                    if (comic.series === "" || comic.number === -1) {
                                        comic.title = comic.filename;
                                    } else {
                                        comic.title = comic.series + " #" + comic.number;
                                    }
                                }
                                comic.loading = true;
                                comic.id = "comic" + (Math.ceil(Math.random() * 1000)).toString(34);
                                console.log(`Adding ${comic.filename}, with id: ${comic.id}`);
                                reader.bookList.push(comic);
                                reader.bookList.sort(sortBook);
                                pipeline.remove();
                                getThumb(comic);
                            })
                        }, comic, "Read info.json");
                    }
                }
            });
        });

    });
}

//Remnant of old dom editing code for future reference when adding back read states
var createBook = function (comic, i) {
    if (!comic.read) {
        div.setAttribute("class", "book box badge is-badge-warning");
    } else {
        div.setAttribute("class", "book box");
    }
}

/**
 * @function getThumb
 * @description Retreives the cover of the book specified by comic
 * @param {*Object} comic 
 */
var getThumb = function (comic) {
    var file = comic.directory + comic.filename + "." + comic.type;
    var i = 0;
    pipeline.addToQueue((args) => {
        console.log("Looking for Thumbs in " + args.comic.title);
        ArchiveManager.Content(args.file, function (err, contents) {
            if (err) {
                console.error(err);
                return;
            }
            var entry = contents[i];
            while (!fileTypes.includes(entry.name.split('.').last() || entry.directory)) {
                i = i + 1;
                entry = contents[i];
            }
            pipeline.addToQueue((args) => {
                console.log("Loading Thumb for " + args.comic.title);
                ArchiveManager.Read(args.entry.name, file, function (err, data) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    args.comic.loading = false;
                    args.comic.thumb = "data:image/jpg;base64," + data.toString('base64');
                    //$(`#${args.comic.id}>figure>svg`).removeClass('is-loading');
                    //$(`#${args.comic.id}>figure>img`).attr('src', "data:image/jpg;base64," + data.toString('base64'));
                    console.log(`Adding Thumb to ${args.comic.id}`);
                    pipeline.remove();
                });
            }, {
                comic: comic,
                file: file,
                entry: entry
            }, 'Read');
            pipeline.remove();
        });
    }, {
        comic: comic,
        file: file
    }, "Content");
}

var saveBook = function (book) {
    console.log("Saving " + book.title);
    pipeline.addToQueue((book) => {
        ArchiveManager.Append(['info.json'], [Buffer.from(JSON.stringify(book))], book.directory + book.filename + '.' + book.type, function (err, files) {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Sucess!");
            pipeline.remove();
        });
    }, book, "Append");
}

var sortList = function () {
    switch ($('#sort-option').val()) {
        case "Title":
            sortBook = sortBookByTitle;
            break;
        case "Author":
            sortBook = sortBookByAuthor;
            break;
        case "File Name":
            sortBook = sortBookByFileName;
            break;
        case "Series":
            sortBook = sortBookBySeries;
            break;
        default:
            sortBook = sortBookByTitle;
    }
    reader.bookList.sort(sortBook);
}