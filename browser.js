
var loadDir = function(){
    fs.readdir(new url.URL("file:///o:/Comics/"),function(err, files){
        if (err) {
           return console.error(err);
        }
        var i=0;
        if(bookList.length!==0){
            bookList = [];
        }
        files.forEach(function(file){
            if(!fs.statSync(new url.URL("file:///o:/Comics/"+file)).isDirectory()){
                if(comicTypes.includes(file.split('.')[file.split('.').length-1])){
                    bookList.push({
                        name:file.replace("."+file.split('.')[file.split('.').length-1],""),
                        directory:"o:/Comics/",
                        type:file.split('.')[file.split('.').length-1]
                    });
                    var td = document.createElement("li");
                    var title = document.createTextNode(bookList.last().name);
                    var thumb = document.createElement("img");
                    thumb.setAttribute('class','thumb');
                    getThumb(bookList.last(),thumb);
                    td.setAttribute("class","book");
                    td.setAttribute('onclick',`press(${i})`);
                    td.appendChild(thumb);
                    td.appendChild(title);
                    document.getElementById('books').appendChild(td);
                    i = i+1;
                }
            }
        });
    });
}

var getThumb = function(comic, thumb){
    var zip = new StreamZip({
        file:new url.URL("file:///"+comic.directory+comic.name+"."+comic.type),        
        storeEntries:true
    });
    zip.on('ready',function(err){
        if(err){
            console.log(err);
            return;
        }
        var i =0;
        var entry = Object.values(zip.entries())[i];
        while(!fileTypes.includes(entry.name.split('.')[entry.name.split('.').length-1]||
        entry.isDirectory)){
            i=i+1;
            entry = Object.values(zip.entries())[i];
        }
        var data = zip.entryDataSync(entry.name);
        thumb.setAttribute('src',"data:image/jpg;base64," + data.toString('base64'));
    });
}