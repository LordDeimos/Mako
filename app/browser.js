const {
    dialog
} = require('electron').remote;

var clearExplorer = function () {
    //Dispose of all div child elements of the div called books
    for (var i = 0; i < bookList.length; i = i + 1) {
        document.getElementById('books').removeChild(document.getElementById(bookList[i].name));
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
        fs.readdir(new url.URL("file:///" + path + '/'), function (err, files) {
            if (err) {
                return console.error(err);
            }
            var i = 0;
            if (bookList.length !== 0) {
                bookList = [];
            }
            var count =0;
            files.forEach(function (file) {
                if (!fs.statSync(new url.URL("file:///" + path + '/' + file)).isDirectory()) {
                    if (comicTypes.includes(file.split('.').last())) {
                        bookList.push({
                            filename: file.replace("." + file.split('.').last(), ""),
                            directory: path + '/',
                            type: file.split('.').last(),
                        });
                        console.log(bookList.last())
                        //var td = document.createElement("div");
                        var div = document.createElement("div");
                        //var title = document.createTextNode(bookList.last().filename);
                        var figure = document.createElement("figure");
                        var thumb = document.createElement("img");
                        var spinner = document.createElement('i');
                        spinner.setAttribute('class', "fas fa-circle-notch fa-spin loading");
                        spinner.id = bookList[i].filename + "Loading";
                        getThumb(bookList[i], thumb);
                        getInfo(bookList.last(),div);
                        figure.setAttribute("class", "image");
                        div.setAttribute("class", "book box");
                        div.setAttribute('id', bookList[i].filename);
                        div.setAttribute('onclick', `loadBook(${i})`);
                        figure.appendChild(thumb);
                        figure.appendChild(spinner);
                        div.appendChild(figure);
                        //div.appendChild(title);
                        //td.appendChild(div);
                        document.getElementById('books').appendChild(div);
                        i = i + 1;
                    }
                }
            });
        });
    });
}

var getInfo = function(comic,title){
    var zip = new StreamZip({
        file: new url.URL("file:///" + comic.directory + comic.filename + "." + comic.type),
        storeEntries: true
    });
    zip.on('ready',function(){
        console.log(Object.values(zip.entries()).length);
        var j=0;
        while(j<Object.values(zip.entries()).length && Object.values(zip.entries())[j].name.split('.').last()!=='json'){
            console.log(Object.values(zip.entries())[j].name.split('.').last());
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
        title.appendChild(document.createTextNode(comic.title));
    });
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