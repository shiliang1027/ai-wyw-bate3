define([
    'jquery',
    'backbone',
    'router'
], function($,Backbone,Router){
    var init=function(){
        console.info("App init");
        ajaxinit();
        var router = new Router();
        Backbone.history.start();
        checkAppUpdate();
        $(document).bind("backbutton", function(){
            hideLoadingMask();
            console.info("Keyboard.isVisible:"+Keyboard.isVisible);
            if (Keyboard.isVisible) {
                Keyboard.hide();
                return;
            }
            if(window.location.href.indexOf("home/home/goModule")!=-1||window.location.href.indexOf("login/login/goModule")!=-1){
                onBackKeyDown();
            }else{
                history.go(-1);
            }
        });
        $(window).error(function(msg, url, line){
            console.error(msg);
            hideLoadingMask();
            return true;
        });
    };
    return {
        initialize: init
    };
});