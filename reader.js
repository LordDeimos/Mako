
var StreamZip = require('node-stream-zip');
var os = require('os');
var fs = require("fs");
var url = require('url');

var bookList=[];
const comicTypes = ['cbr','cbz','cb7'];
const fileTypes=['png','jpg','gif','bmp','jpeg','tiff'];
var totalPages =0;

Array.prototype.last = function(){
    return this[this.length-1];
}

var pageDisplay = false;
var dummy = false;

var currentBook = {};
var press = function(book){
    console.log("Closing old book");
    closeBook();
    totalPages = 0;
    dummy = false;
    console.log("Loading "+bookList[book].name);
    var zip = new StreamZip({
        file:new url.URL("file:///"+bookList[book].directory+bookList[book].name+"."+bookList[book].type),
        storeEntries:true
    });
    currentBook = {
        title:'',
        pages:[]
    };

    var i = 0;
    zip.on('ready',function(){
        //for(var entry of Object.values(zip.entries())){
        Object.values(zip.entries()).forEach(function(entry){
            if(!entry.isDirectory){
                if(fileTypes.includes(entry.name.split('.')[entry.name.split('.').length-1])){
                    i = i+1;
                    var div = document.createElement("td");
                    var figure = document.createElement("figure");
                    var elem = document.createElement("img");
                    figure.setAttribute('class',"image");
                    div.setAttribute('class',"book");
                    var data = zip.entryDataSync(entry.name);//this is bad, try for async
                    currentBook.pages.push(data);
                    elem.setAttribute("src", "data:image/jpg;base64," + currentBook.pages.last().toString('base64'));
                    elem.setAttribute("name", entry.name);
                    div.id = i.toString();
                    figure.appendChild(elem);
                    div.appendChild(figure);
                    div.style.display = 'none';
                    document.getElementById('pages').appendChild(div);
                }
            }
        });
        console.log(i);
        if((i%2)!==0){
            var div = document.createElement("td");
            div.setAttribute('class',"page")
            div.id = (i+1).toString();
            div.style.display = 'none';
            document.getElementById('pages').appendChild(div);
            dummy=true;
            if(pageDisplay){
                i=i+1;
            }
        }
        $('#1').fadeIn(); 
        if(pageDisplay){
            $('#2').fadeIn();
        }
        totalPages = i;
        zip.close();
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
        switch(pageDisplay){
            case true:
                var ani1=true, ani2=true;
                if(pageCounter!==2){
                    $(`#${pageCounter}`).fadeOut(function(){
                        $(`#${pageCounter-2}`).fadeIn(function(){
                            ani1 = false;
                            animating = ani1&&ani2;
                        });
                    });
                }
                $(`#${pageCounter+1}`).fadeOut(function(){
                    $(`#${pageCounter-1}`).fadeIn(function(){
                        pageCounter = pageCounter-2;
                        if(pageCounter===0){
                            pageCounter = 1;
                        }
                        ani2 = false;
                        animating = ani1&&ani2;
                    });
                });
                break;
            case false:
                $(`#${pageCounter}`).fadeOut(function(){
                    $(`#${pageCounter-1}`).fadeIn(function(){
                        pageCounter = pageCounter-1;
                        if(pageCounter===0){
                            pageCounter = 1;
                        }
                        animating = false;
                    });
                });
                break;
        }
    }
};

var right = function(){
    if(animating){
        return;
    }
    var turn = (pageDisplay)?(pageCounter!==totalPages-1):(pageCounter!==totalPages);
    if(turn){ 
        animating=true;
        switch(pageDisplay){
            case true:
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
                break;
            case false:
                $(`#${pageCounter}`).fadeOut(function(){
                    $(`#${pageCounter+1}`).fadeIn(function(){
                        pageCounter = pageCounter+1;
                        animating = false;
                    });
                });
                break;
        }
        
    }
};

var arrangePages = function(){
    pageDisplay = document.getElementById('pageno').checked;
    animating = true;
    switch(pageDisplay){
        case true:
            $(`#${pageCounter+1}`).fadeIn(function(){
                animating = false;
            });
            if(dummy){
                totalPages = totalPages+1;
            }
            break;
        case false:
            $(`#${pageCounter+1}`).fadeOut(function(){
                animating = false;
            });
            if(dummy){
                totalPages = totalPages-1;
            }
            break;
    }
};

var closeBook = function(){
    //Dispose of all td child elements of the tr called pages
    var trueTotal = (dummy)?totalPages+1:totalPages;
    for(var i=1;i<=trueTotal;i=i+1){
        document.getElementById('pages').removeChild(document.getElementById(i.toString()));
        console.log("Removing page "+i);
    }
    totalPages = 0;
    dummy = false;
};