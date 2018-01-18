var electron = require('electron');
var dialog = electron.dialog || electron.remote.dialog;
var fs = require('fs');

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
    constructor(path){
        this.path = path;
        if(!fs.existsSync(path)){
            fs.writeFileSync(path,JSON.stringify(defaultSettings,null,"\t"));
        }
        this.settings = JSON.parse(fs.readFileSync(this.path));
    }

    save(){
        fs.writeFileSync(this.path,JSON.stringify(this.settings,null,"\t"));
    }
}

module.exports = UserSettings;