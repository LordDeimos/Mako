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


var showAbout = function () {
    var aboutPage = new remote.BrowserWindow({
        parent: remote.getCurrentWindow(),
        show: false,
        frame: false,
        modal: true,
        width: 500,
        height: 400
    });
    aboutPage.setResizable(false);
    aboutPage.loadURL(url.format({
        pathname: path.join(__dirname, 'about.html'),
        protocol: 'file:',
        slashes: true
    }));
    aboutPage.on('closed', () => {
        aboutPage = null
    });
    aboutPage.on('ready-to-show', function(){
        aboutPage.show();
    });
}