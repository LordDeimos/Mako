const {
    dialog
} = require('electron').remote;

var clearExplorer = function () {
    //Dispose of all div child elements of the div called books
    try{
        var books = document.getElementById('books');
        while(books.firstChild){
            books.removeChild(books.firstChild);
            bookList = bookList.slice(1);
        }
    }
    catch(err){
        console.error(err);
    }
    bookList = [];
};

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

var loadDir = function () {
    dialog.showOpenDialog({
        properties: ['openDirectory']
    }, function (filePaths) {
        clearExplorer();
        var path = filePaths[0].replace('\\', '/');
        fs.readdir(new url.URL("file:///" + path + '/'), function (err, files) {
            if (err) {
                return console.error(err);
            }
            var i = 0;
            if (bookList.length !== 0) {
                bookList = [];
            }
            var count =0;
            files.sort();
            files.forEach(function (file) {
                if (!fs.statSync(new url.URL("file:///" + path + '/' + file)).isDirectory()) {
                    if (comicTypes.includes(file.split('.').last())) {
                        var comic = {
                            filename: file.replace("." + file.split('.').last(), ""),
                            directory: path + '/',
                            type: file.split('.').last(),
                            read: true,
                        };
                        var zip = new StreamZip({
                            file: new url.URL("file:///" + comic.directory + comic.filename + "." + comic.type),
                            storeEntries: true
                        });
                        zip.on('ready',function(){
                            var j=0;
                            while(j<Object.values(zip.entries()).length && Object.values(zip.entries())[j].name.split('.').last()!=='json'){
                                var entry = Object.values(zip.entries())[j];
                                ++j;
                            }
                            j = (j===Object.values(zip.entries()).length)?j-1:j;
                            if(Object.values(zip.entries())[j].name.split('.').last()==='json'){
                                var info = JSON.parse(zip.entryDataSync(Object.values(zip.entries())[j]));
                                Object.assign(comic, info);
                                if(comic.title===""){
                                    comic.title = comic.series +" #"+comic.number;
                                }
                            }
                            else{            
                                comic.title = comic.filename;
                            }
                            bookList.push(comic);
                            bookList.sort(sortBook);
                            if(bookList.length===i-1){
                                var k = 0;
                                bookList.forEach(function(){
                                    createBook(bookList[k],k);
                                    ++k;
                                });
                            }
                        });

                        i = i + 1;
                    }
                }
            });
        });
    });
}

var createBook = function (comic,i) {
    var div = document.createElement("div");
    var figure = document.createElement("figure");
    var thumb = document.createElement("img");
    getThumb(comic,thumb);
    var spinner = document.createElement('i');
    spinner.setAttribute('class', "fas fa-circle-notch fa-spin loading");
    spinner.id = comic.filename + "Loading";

    figure.setAttribute("class", "image");
    if (!comic.read) {
        div.setAttribute("class", "book box badge is-badge-warning");
    } else {
        div.setAttribute("class", "book box");
    }
    div.setAttribute('id', comic.filename);
    div.setAttribute('onclick', `loadBook(${i})`);
    figure.appendChild(thumb);
    figure.appendChild(spinner);
    div.appendChild(figure);
    div.setAttribute('data-badge', "");
    div.appendChild(document.createTextNode(comic.title));
    document.getElementById('books').appendChild(div);
}

var getThumb = function (comic, thumb) {
    /*p7zip.list(comic.directory + comic.name + "." + comic.type).then(function(data){
        data.files.forEach(function (file, index) {
            console.log(file);
        });
    });*/
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
        document.getElementById(comic.filename + "Loading").remove();
        thumb.setAttribute('src', "data:image/jpg;base64," + data.toString('base64'));
    });
    
}