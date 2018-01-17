var electron = require('electron');
var dialog = electron.dialog || electron.remote.dialog;
class Test{
    constructor(message){
        this.message = message;
    }
    test(){
        dialog.showMessageBox({message:this.message});
    };
}

module.exports = Test;