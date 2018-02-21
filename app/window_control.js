var closeWindow = function () {
    var window = remote.getCurrentWindow();
    window.close();
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


var closeEdit = function () {
    $('#edit').animate({
        opacity: 0
    }, '0.4s', function () {
        $('#edit').removeClass('is-active');
    });
}

var handleSubmit = function(event){
    if(event.keyCode===13){
        $('#save-book').click();
    }
}