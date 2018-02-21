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
