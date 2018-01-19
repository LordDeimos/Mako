var electron = require('electron');
var dialog = electron.dialog || electron.remote.dialog;
var fs = require('fs');
var path = require('path');

var dataPath = path.join(electron.app.getPath('userData'),'settings.json');

var defaultSettings = {
    maximised:false,
    bounds:{
        x:undefined,
        y:undefined,
        width:1280,
        height:720
    },
};
class UserSettings{
    constructor(){
        if(!fs.existsSync(dataPath)){
            fs.writeFileSync(dataPath,JSON.stringify(defaultSettings,null,"\t"));
        }
        this.settings = JSON.parse(fs.readFileSync(dataPath));
    }

    save(){
        fs.writeFileSync(dataPath,JSON.stringify(this.settings,null,"\t"));
    }
}

module.exports = UserSettings;