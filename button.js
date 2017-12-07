var StreamZip = require('node-stream-zip');
var os = require('os');
var fs = require("fs");
var url = require('url');
var comicPath = (os.platform() === 'win32') ? new url.URL("file:///o:/Comics/DC Comics - Bombshells 099 (2017) (digital) (Minutemen-Thoth).cbz") : '/media/alex/Comics/Comics/etc...';

var bookList=[];
const comicTypes = ['cbr','cbz','cb7'];
var totalPages =0;

Array.prototype.last = function(){
    return this[this.length-1];
}
var currentBook = {};
var press = function(book){
    console.log("Loading "+bookList[book].name);
    var zip = new StreamZip({
        file:new url.URL("file:///"+bookList[book].directory+bookList[book].name+"."+bookList[book].type),
        storeEntries:true
    });
    var fileTypes=['png','jpg','gif','bmp'];
    currentBook = {
        title:'',
        pages:[]
    };
    zip.extract(null,'./resources',function(err,count){
        if(err){
            console.log(err);
            return;
        }
        var i = 0;
        for(var entry of Object.values(zip.entries())){
            if(!entry.isDirectory){
                if(fileTypes.includes(entry.name.split('.')[entry.name.split('.').length-1])){
                    i = i+1;
                    var div = document.createElement("td");
                    var elem = document.createElement("img");
                    div.setAttribute('class',"page");
                    var data = fs.readFileSync(`resources/${entry.name}`);
                    currentBook.pages.push(data);
                    //console.log(currentBook.pages.last());
                    var b64encoded = currentBook.pages.last().toString('base64');//btoa(String.fromCharCode.apply(null, currentBook.pages.last()));
                    var datajpg = "data:image/jpg;base64," + b64encoded;
                    elem.setAttribute("src", `${datajpg}`);
                    console.log(elem);
                    div.id = i.toString();
                    div.appendChild(elem);
                    div.style.display = 'none';
                    document.getElementById('pages').appendChild(div);
                }
            }
        }
        $('#1').fadeIn(); 
        $('#2').fadeIn();  
        totalPages = i; 
        console.log(totalPages);
    });
};

var pageCounter = 1;
var animating = false;
var left = function(){
    if(animating){
        return;
    }
    if(pageCounter!==1){
        animating=true;
        var ani1=true, ani2=true;
        $(`#${pageCounter}`).fadeOut(function(){
            $(`#${pageCounter-2}`).fadeIn(function(){
                ani1 = false;
                animating = ani1&&ani2;
            });
        });
        $(`#${pageCounter+1}`).fadeOut(function(){
            $(`#${pageCounter-1}`).fadeIn(function(){
                pageCounter = pageCounter-2;
                ani2 = false;
                animating = ani1&&ani2;
            });
        });
    }
};

var right = function(){
    if(animating){
        return;
    }
    if(pageCounter!==totalPages){ 
        animating=true;
        var ani1=true, ani2=true;
        $(`#${pageCounter}`).fadeOut(function(){
            $(`#${pageCounter+2}`).fadeIn(function(){
                ani1 = false;
                animating = ani1&&ani2;
            });
        });
        $(`#${pageCounter+1}`).fadeOut(function(){
            $(`#${pageCounter+3}`).fadeIn(function(){
                pageCounter = pageCounter+2;
                ani2 = false;
                animating = ani1&&ani2;
            });
        });
    }
};

var loadDir = function(){
    fs.readdir(new url.URL("file:///o:/Comics/"),function(err, files){
        if (err) {
           return console.error(err);
        }
        var i=0;
        if(bookList.length!==0){
            bookList = [];
        }
        files.forEach( function (file){
            if(!fs.statSync(new url.URL("file:///o:/Comics/"+file)).isDirectory()){
                if(comicTypes.includes(file.split('.')[file.split('.').length-1])){
                    bookList.push({
                        name:file.replace("."+file.split('.')[file.split('.').length-1],""),
                        directory:"o:/Comics/",
                        type:file.split('.')[file.split('.').length-1]
                    });
                    var td = document.createElement("li");
                    td.setAttribute("class","book");
                    td.setAttribute('onclick',`press(${i})`);
                    td.innerHTML = bookList.last().name;
                    document.getElementById('books').appendChild(td);
                    i = i+1;
                }
            }
        });
    });
}