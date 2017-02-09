var exec = require('cordova/exec');

var ActivityIndicator ={};

ActivityIndicator.show=function(text){
  text = text || "请稍等...";
        cordova.exec(null, null, "ActivityIndicator", "show", [text]);
}
ActivityIndicator.hide=function(){
	 cordova.exec(null, null, "ActivityIndicator", "hide", []);
}

module.exports = ActivityIndicator;