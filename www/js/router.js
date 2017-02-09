/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery','underscore','backbone','jqm'],function($,_,Backbone){
    'use strict';
    var Router = Backbone.Router.extend({
        routes:{
            '':'showLogin',
            '*actions':'defaultAction'
        },
        initialize: function(options) {
            this.route(/^(.*?)\/goModule$/, "goModule");
            var self=this;
            Backbone.on('goModule', function(option){
                self.navigate(option.moduleurl+'/goModule', {trigger: true});
            }, this);
            this.pageCache={}
        },
        goModule:function(module){
            console.info(module)
            var self= this;
            if(this.pageCache[module]){
                self.changePage(this.pageCache[module]);
            }else{
                require([module],function(View){
                    var view = new View();
                    $(view.el).attr('data-role', 'page');
                    view.render();
                    $('body').append($(view.el));
                    self.changePage($(view.el));
                    if($(view.el).find("div[dom-cache=true]").length > 0){
                        self.pageCache[module]=$(view.el);
                        self.pageCache[module].unbind("pagehide");
                        self.pageCache[module].unbind("pageshow");
                    }else{
                        $(view.el).one('pagehide', function (event, ui) {
                            view.remove();
                        });
                    }
                }, function (err) {
                    console.error(err)
                    showToast("功能建设中，敬请期待……");
                    history.go(-1);
                });
            }
        },
        defaultAction:function(actions){
            this.showLogin();
//            this.navigate('modules/demo/home/home/goModule', {trigger: true});
        },
        showLogin:function(actions){
            this.navigate('modules/login/login/goModule', {trigger: true});
        },
        changePage:function(htmlObj){
//            $('div[data-role="page"]').remove();
//            debugger;
//            page.render();
            $.mobile.changePage(htmlObj, {changeHash:false,transition: "none"});
//            $('div[data-role="page"]').one('pagehide', function (event, ui) {
//                page.remove();
//            });
        }
    });
    return Router;
});