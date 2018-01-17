var remote = require('electron').remote;

remote.getCurrentWindow().on('resize',function(){
    console.log("Resizing");
    setHeight();
});

var closeWindow = function(){
    var window = remote.getCurrentWindow();
    console.log('Closing');
    window.close();
};

var maximiseWindow = function(){
    var window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
        window.maximize();
    }
    else {
        window.unmaximize();
    }
};

var minimiseWindow = function(){
    var window = remote.getCurrentWindow();
    window.minimize();
};

var setHeight = function(){
    var window = remote.getCurrentWindow();
    var currentHeight = window.getBounds().height;
    document.getElementById('bookStuff').style="height: "+currentHeight*0.76+"px";
    document.getElementById('reader').style="height: "+currentHeight*0.76+"px";
    document.getElementById('pages').style="height: "+$('#reader').height()+"px";
    $('.page').maxheight = $('#reader').height();
    //document.getElementById('bookStuff').style="height: 100vh";
}