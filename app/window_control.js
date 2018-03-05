var closeWindow = function () {
    var window = remote.getCurrentWindow();
    if(!pipeline.processing){
        window.close();
    }
    else{
        openModal($('#close-warning'));
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


var openModal = function(element){
    element.addClass('is-active');
    element.animate({
            opacity: 1
    }, '0.4s');
}

var closeModal = function(element){    
    element.animate({
        opacity: 0
    }, '0.4s', function () {
        element.removeClass('is-active');
    });
}

var handleSubmit = function(event){
    if(event.keyCode===13){
        $('#save-book').click();
    }
}