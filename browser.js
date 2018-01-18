const {
    dialog
} = require('electron').remote;

var clearExplorer = function () {
    //Dispose of all div child elements of the div called books
    for (var i = 0; i < bookList.length; i = i + 1) {
        document.getElementById('books').removeChild(document.getElementById(bookList[i].name));
        console.log("Removing book: " + bookList[i].name);
        bookList = bookList.slice(1);
    }
    bookList = [];
};

var loadDir = function () {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, function (filePaths) {
        clearExplorer();
        var path = filePaths[0].replace('\\', '/');
        console.log(path);
        fs.readdir(new url.URL("file:///" + path + '/'), function (err, files) {
            if (err) {
                return console.error(err);
            }
            var i = 0;
            if (bookList.length !== 0) {
                bookList = [];
            }
            files.forEach(function (file) {
                console.log(file);
                if (!fs.statSync(new url.URL("file:///" + path + '/' + file)).isDirectory()) {
                    if (comicTypes.includes(file.split('.')[file.split('.').length - 1])) {
                        bookList.push({
                            name: file.replace("." + file.split('.')[file.split('.').length - 1], ""),
                            directory: path + '/',
                            type: file.split('.')[file.split('.').length - 1]
                        });
                        var td = document.createElement("div");
                        var div = document.createElement("div");
                        var title = document.createTextNode(bookList.last().name);
                        var figure = document.createElement("figure");
                        var thumb = document.createElement("img");
                        var spinner = document.createElement('i');
                        spinner.setAttribute('class', "fas fa-circle-notch fa-spin loading");
                        spinner.id = bookList.last().name + "Loading";
                        getThumb(bookList.last(), thumb);
                        figure.setAttribute("class", "image");
                        td.setAttribute("class", "book box");
                        td.setAttribute('id', bookList.last().name);
                        td.setAttribute('onclick', `press(${i})`);
                        figure.appendChild(thumb);
                        figure.appendChild(spinner);
                        td.appendChild(figure);
                        div.appendChild(title);
                        td.appendChild(div);
                        document.getElementById('books').appendChild(td);
                        i = i + 1;
                    }
                }
            });
        });
    });
}

var getThumb = function (comic, thumb) {
    p7zip.list(comic.directory + comic.name + "." + comic.type).then(function(data){
        data.files.forEach(function (file, index) {
            console.log(file);
        });
    });
    /*var zip = new StreamZip({
        file: new url.URL("file:///" + comic.directory + comic.name + "." + comic.type),
        storeEntries: true
    });
    zip.on('ready', function (err) {
        if (err) {
            console.log(err);
            return;
        }
        var i = 0;
        var entry = Object.values(zip.entries())[i];
        while (!fileTypes.includes(entry.name.split('.')[entry.name.split('.').length - 1] ||
                entry.isDirectory)) {
            i = i + 1;
            entry = Object.values(zip.entries())[i];
        }
        var data = zip.entryDataSync(entry.name);
        document.getElementById(comic.name + "Loading").remove();
        thumb.setAttribute('src', "data:image/jpg;base64," + data.toString('base64'));
    });*/
}