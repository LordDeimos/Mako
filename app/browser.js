const {
    dialog
} = require('electron').remote;

var clearExplorer = function () {
    books.bookList = [];
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
                        };
                        var zip = new StreamZip({
                            file: new url.URL("file:///" + comic.directory + comic.filename + "." + comic.type),
                            storeEntries: true
                        });

                        
                        zip.on('error', err => {
                            console.error(err)
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
                            comic.loading=true;
                            comic.id = "comic"+books.bookList.length;
                            getThumb(comic);          
                            books.bookList.push(comic)                  
                            books.bookList.sort(sortBook);
                            zip.close();
                        });
                    }
                }
            });
        });
    });
}

//Remnant of old dom editing code for future reference when adding back read states
var createBook = function (comic,i) {
    if (!comic.read) {
        div.setAttribute("class", "book box badge is-badge-warning");
    } else {
        div.setAttribute("class", "book box");
    }
}

var getThumb = function (comic) {
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
        comic.loading = false;
        $(`#${comic.id}>figure>svg`).remove();
        $(`#${comic.id}>figure>img`).attr('src',"data:image/jpg;base64," + data.toString('base64'));
        zip.close();
    });
    
}