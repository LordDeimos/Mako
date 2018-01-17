var remote = require('electron').remote;

remote.getCurrentWindow().on('resize',function(){
    console.log("Resizing");
    //setHeight();
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

var showAbout = function(){
    var aboutPage = new remote.BrowserWindow({parent:remote.getCurrentWindow(),show:false,frame:false,width:500,height:400});
    aboutPage.setResizable(false);
    aboutPage.loadURL(url.format({pathname:path.join(__dirname,'about.html'),protocol:'file:',slashes:true}));
    aboutPage.on('closed', ()=>{aboutPage=null});
    aboutPage.once('ready-to-show',aboutPage.show());
}