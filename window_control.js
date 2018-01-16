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
    if(window.isMaximized()){
        document.getElementById('bookStuff').style="height: 80vh;";
    }
    else{
        document.getElementById('bookStuff').style="height: 76vh;";
    }
    console.log(remote.getCurrentWindow().innerHeight);
}