
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
var sortBook = function(a,b){
    var titleA = a.title.toLowerCase()
    var titleB = b.title.toLowerCase();
    if(titleA<titleB){
        return -1;
    }
    else if(titleB<titleA){
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
        if(filePaths===undefined){
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
                            rtol:false
                        };
                        ipcRenderer.send('get-info',comic);
                    }
                }
            });
        });
    });
}

ipcRenderer.on('push-book',function(event,arg){
    //console.log(arg);
    arg.loading=true;
    arg.id = "comic"+books.bookList.length;          
    books.bookList.push(arg)                  
    books.bookList.sort(sortBook);
    getThumb(arg);
});

//Remnant of old dom editing code for future reference when adding back read states
var createBook = function (comic,i) {
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
    ipcRenderer.send('get-thumb',comic);
}

ipcRenderer.on('display-thumb',function(event,arg){
    $(`#${arg.book.id}>figure>svg`).remove();
    $(`#${arg.book.id}>figure>img`).attr('src', "data:image/jpg;base64," + arg.thumb.toString('base64'));
});