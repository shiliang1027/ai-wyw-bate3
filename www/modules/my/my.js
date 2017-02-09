define(['jquery', 'underscore', 'backbone', 'iscroll', 'text!modules/my/viewTemplate.html'], function($, _, Backbone, IScroll, ViewTemplate) {
	var view = Backbone.View.extend({
		template : _.template(ViewTemplate),
		events : {
			"pageshow" : "pageShow"
		},
		initialize : function(options) {
            this._version=sessionStorage.getItem("version");
		},
		pageShow : function() {
			var self = this;
			new IScroll('#myPage .content', {
				preventDefault : false,
				bounceEasing : 'circular',
				bounceTime : 1200
			});
			$(document).bind('touchmove', function(e) {
				e.preventDefault();
			});
			var username = sessionStorage.getItem("username");
			$("#username").html(username);
			$("#quitSys").on("tap", function() {
				self.quitSysHandler();
			});
		},
		quitSysHandler : function() {
			var self = this;
//			$.support.cors = true;
			var sessionId = sessionStorage.getItem('sessionId');
			$.ajax({
				url : actionInfo.url + actionInfo.logout,
				type : "post",
				dataType : "json",
				data : $("form#quitform").serialize(),
				success : function(data, status, xhr) {
                    console.info(data)
                    if(data && parseInt(data.code)==1){
                        sessionStorage.setItem('username', "");
                        sessionStorage.setItem('usercode', "");
                        sessionStorage.setItem('userPassword', "");
                        sessionStorage.setItem('userMenus', "");

//                    window.location.href="welcome.html";
//                        $.removeCookie("jsessionid");
                    Backbone.trigger("goModule",{"moduleurl":"modules/login/login"});
                    }

				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					self.windowPop("退出系统异常！");
				}
			});
		},
		windowPop : function(Str) {
			var Win = new WinBox({
				container:this.el,
				html: "<ul>" + Str + "</ul>",
				title:'提示'
			});
		},
		render : function() {
			this.$el.html(this.template({"version":this._version}));
			return this;
		}
	});
	return view;
}); 