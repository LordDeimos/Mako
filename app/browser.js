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
var sortBook = function (a, b) {
    var titleA = a.title.toLowerCase()
    var titleB = b.title.toLowerCase();
    if (titleA < titleB) {
        return -1;
    } else if (titleB < titleA) {
        return 1;
    }
    return 0;
}

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
                            title: ""
                        };
                        var file = new url.URL("file:///" + comic.directory + comic.filename + "." + comic.type);

                        var jsonFile = ArchiveManager.ReadBuffer('info.json', comic.directory + comic.filename + "." + comic.type);
                        var info = (jsonFile.length) ? JSON.parse(jsonFile) : {};
                        Object.assign(comic, info);
                        if (comic.title === "") {
                            if (comic.series === "" || comic.number === -1) {
                                comic.title = comic.filename;
                            } else {
                                comic.title = comic.series + " #" + comic.number;
                            }
                        }
                        comic.loading = true;
                        comic.id = "comic" + books.bookList.length;
                        books.bookList.push(comic)
                        books.bookList.sort(sortBook);
                        getThumb(comic);
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
    var contents = ArchiveManager.ListContent(file);
    var entry = contents[i];
    while (!fileTypes.includes(entry.split('.').last() ||
            ArchiveManager.GetInfo(entry, file).directory)) {
        i = i + 1;
        entry = contents[i];
    }
    var data = ArchiveManager.ReadBuffer(entry, file);
    comic.loading = true;

    //$(`#${comic.id}>figure>svg`).remove();
    $(`#${comic.id}>figure>img`).attr('src', "data:image/jpg;base64," + data.toString('base64'));
    console.log($(`#${comic.id}`));
}