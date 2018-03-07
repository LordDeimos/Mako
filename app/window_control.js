var closeWindow = function () {
    var window = remote.getCurrentWindow();
    if(!pipeline.processing){
        window.close();
    }
    else{
        console.log('Doing A Thing')
        reader.showCloseWarning=true;
    }
};

var maximiseWindow = function () {
    var window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
        window.maximize();
    } else {
        window.unmaximize();
    }
};

var minimiseWindow = function () {
    var window = remote.getCurrentWindow();
    window.minimize();
};


var openWebsite = function (page) {
    shell.openExternal(page);
};

var handleSubmit = function(event){
    if(event.keyCode===13){
        $('#save-book').click();
    }
}