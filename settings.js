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

/**
 * @class UserSettings
 * @description Creates a wrapper for the settings JSON file
 */
class UserSettings{
    constructor(){
        if(!fs.existsSync(dataPath)){
            fs.open(dataPath,'wx',function(err){
                if(err){
                    console.log(err);
                }
            })
            fs.writeFileSync(dataPath,JSON.stringify(defaultSettings,null,"\t"));
        }
        this.settings = JSON.parse(fs.readFileSync(dataPath));
    }

    /**
     * @function save
     * @description Write Updated Settings to Disk
     */
    save(){
        fs.writeFileSync(dataPath,JSON.stringify(this.settings,null,"\t"));
    }
}

module.exports = UserSettings;