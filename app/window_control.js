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


var openAbout = function(){
    $('#about').addClass('is-active');
    $('#about').animate({
            opacity: 1
    }, '0.4s');
}

var closeAbout = function(){
    $('#about').animate({
        opacity: 0
    }, '0.4s', function () {
        $('#about').removeClass('is-active');
    });
}

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