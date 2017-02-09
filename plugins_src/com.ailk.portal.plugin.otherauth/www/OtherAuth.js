var exec = require('cordova/exec');

var OtherAuth ={};

OtherAuth.otherAuth=function(success,error){
   cordova.exec(success, error, 'OtherAuth', 'otherAuth', []);
}


module.exports = OtherAuth;