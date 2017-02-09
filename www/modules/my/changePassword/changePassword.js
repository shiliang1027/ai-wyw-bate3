define(['jquery', 'underscore', 'backbone', 'iscroll', 'text!modules/my/changePassword/viewTemplate.html'], function($, _, Backbone, IScroll, ViewTemplate) {
	var view = Backbone.View.extend({
		template : _.template(ViewTemplate),
		events : {
			"pageshow" : "pageShow",
			"input #userPassword" : "inputPwd",
			"input #newPwd" : "inputNewPwd",
			"input #msNewPassword" : "inputMsNewPwd"
		},
		initialize : function(options) {
			this.usercode = sessionStorage.getItem("usercode");
			this.userPwd = "";
			//修改密码
			this.changePasswordUrl = 'webapp/userAction!updateUser.action';
		},
		pageShow : function() {
			var self = this;
			new IScroll('#changePasswordPage .content', {
				preventDefault : false,
				bounceEasing : 'circular',
				bounceTime : 1200
			});
			$(document).bind('touchmove', function(e) {
				e.preventDefault();
			});
			$("#changePassword").focus();

			$("#usercode").val(this.usercode);

			$("#changePassword").on("tap", function() {
				this.userPwd = sessionStorage.getItem("userPassword");
				var newPwd = $.trim($("#newPwd").val()), msNewPassword = $.trim($("#msNewPassword").val()), userPassword = $.trim($("#userPassword").val());
				self.changePassword(this.userPwd, userPassword, newPwd, msNewPassword);
			});
		},
		changePassword : function(userPwd, userPassword, rememberMe, msNewPassword) {
			var self = this;
			$.support.cors = true;
			if (!self.validUserPwdNull(userPassword)) {
				return;
			}
			if (!self.thvalidUserPwd(userPwd, userPassword)) {
				return;
			}

			if (self.validNewUserPwdNUll(rememberMe, msNewPassword)) {
				return;
			}
			if (!self.validNewUserPwd(rememberMe, msNewPassword)) {
				return;
			}
			var sessionId = sessionStorage.getItem('sessionId');
			$.ajax({
				url : actionInfo.url + this.changePasswordUrl + ";jsessionid=" + sessionId,
				type : "post",
				dataType : "json",
				data : $("form#changePwdform").serialize(),
				success : function(data, status, xhr) {
					if (data.code == 1) {
						sessionStorage.setItem('userPassword', $.trim($("#newPwd").val()));
						$("#userPassword").val("");
						$("#newPwd").val("");
						$("#msNewPassword").val("");
						self.windowPop("修改密码成功！");
					} else {
						$("#userPassword").val("");
						$("#newPwd").val("");
						$("#msNewPassword").val("");
						self.windowPop("修改密码失败！");
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					self.windowPop("修改密码失败！");
				}
			});
		},
		/**
		 * 验证原密码是否为空
		 */
		validUserPwdNull : function(userPassword) {
			if (userPassword.length == 0) {
				this.windowPop("原密码不能为空！");
				$("#userPassword").addClass("px error-bor");
				return false;
			} else {
				$("#userPassword").removeClass("px error-bor");
				$("#userPassword").addClass("px");
				return true;
			}
		},
		/**
		 * 验证用输入密码是否与原密码一致
		 */
		validUserPwd : function(userPwd, userPassword) {
			if (userPassword == userPwd) {
				$("#userPassword").removeClass("px error-bor");
				$("#userPassword").addClass("px");
				return true;
			} else {
				this.windowPop("输入密码与原密码不一致，请重新输入！");
				$("#userPassword").addClass("px error-bor");
				$("#userPassword").val("");
				return false;
			}
		},
		/**
		 * 验证新密码是否与确认密码一致
		 */
		validNewUserPwdNUll : function(rememberMe, msNewPassword) {
			if (rememberMe == "" || rememberMe == null || msNewPassword == "" || msNewPassword == null) {
				this.windowPop("新密码与确认密码不能为空！");
				$("#msNewPassword").addClass("px error-bor");
				$("#newPwd").addClass("px error-bor");
				return true;
			} else {
				$("#msNewPassword").removeClass("px error-bor");
				$("#msNewPassword").addClass("px");
				$("#newPwd").removeClass("px error-bor");
				$("#newPwd").addClass("px");
				return false;
			}
		},
		/**
		 * 验证新密码是否与确认密码一致
		 */
		validNewUserPwd : function(rememberMe, msNewPassword) {
			if (rememberMe == msNewPassword) {
				$("#msNewPassword").removeClass("px error-bor");
				$("#msNewPassword").addClass("px");
				return true;
			} else {
				this.windowPop("验证新密码与确认密码不一致，请重新输入！");
				$("#msNewPassword").addClass("px error-bor");
				$("#msNewPassword").val("");
				return false;
			}
		},
		windowPop : function(Str) {
			var Win = new WinBox({
				container:this.el,
				html: "<ul>" + Str + "</ul>",
				title:'提示'
			});
		},
		inputPwd : function() {
			if ($("#userPassword").val().length == 0) {
				$("#userPassword").addClass("px error-bor");
			} else {
				$("#userPassword").removeClass("px error-bor");
				$("#userPassword").addClass("px");
			}
		},
		inputNewPwd : function() {
			if ($("#newPwd").val().length == 0) {
				$("#newPwd").addClass("px error-bor");
			} else {
				$("#newPwd").removeClass("px error-bor");
				$("#newPwd").addClass("px");
			}
		},
		inputMsNewPwd : function() {
			if ($("#msNewPassword").val().length == 0) {
				$("#msNewPassword").addClass("px error-bor");
			} else {
				$("#msNewPassword").removeClass("px error-bor");
				$("#msNewPassword").addClass("px");
			}
		},
		render : function() {
			this.$el.append(this.template());
			return this;
		}
	});
	return view;
}); 