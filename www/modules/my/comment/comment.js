define(['jquery', 'underscore', 'backbone', 'iscroll', 'text!modules/my/comment/viewTemplate.html'], function($, _, Backbone, IScroll, ViewTemplate) {
	var view = Backbone.View.extend({
		template : _.template(ViewTemplate),
		events : {
			"pageshow" : "pageShow",
			"input #c_context" : "inputContext"
		},
		initialize : function(options) {
			this.c_kind = "";
			this.type = "";
			this.arr = ["速度慢", "非常难用", "丑爆了", "数据不准"];
			//吐槽
			this.commentUrl = "webapp/commentAction!saveComment.action";
		},
		pageShow : function() {
			var self = this;
			new IScroll('#commentPage .content', {
				preventDefault : false,
				bounceEasing : 'circular',
				bounceTime : 1200
			});
			$(document).bind('touchmove', function(e) {
				e.preventDefault();
			});
			$("#submit").focus();
			$("#contentType").on("tap", function() {
				self.popSelectTypeWin();
			});
			$("#submit").on("tap", function() {
				self.submitHandler();
			});
		},
		//弹出窗口
		popSelectTypeWin : function() {
			var self = this;
			var htmlStr = "";
			$.each(this.arr, function(i, val) {
				htmlStr += self.getObjItem(val);
			});
			
			var Win = new WinBox({
				container:this.el,
				html: "<ul>" + htmlStr + "</ul>",
				title:'吐槽类型',
				callback:function(){
					$(".window li").each(function() {
						$(this).on("tap", function(e) {
							self.selectType($(this));
							Win.closeWinBox();
							e.preventDefault();
						});
					});
				}
			});
		},
		getObjItem : function(val) {
			if (this.type == val) {
				var str = "<li class='on' value='" + val + "'>" + val + "</li>";
			} else {
				var str = "<li value='" + val + "'>" + val + "</li>";
			}
			return str;
		},
		swicthUserInfoType : function(type) {
			switch(type) {
			case '速度慢':
				$("#contentType").val("速度慢");
				$("#hiddenInput").val(1);
				break;
			case '非常难用':
				$("#contentType").val("非常难用");
				$("#hiddenInput").val(2);
				break;
			case '丑爆了':
				$("#contentType").val("丑爆了");
				$("#hiddenInput").val(3);
				break;
			case '数据不准':
				$("#contentType").val("数据不准");
				$("#hiddenInput").val(4);
				break;
			default:
				$("#contentType").val("速度慢");
				$("#hiddenInput").val(1);
			}
		},
		submitHandler : function() {
			var self = this;
			$.support.cors = true;
			var input = $.trim($("#c_tel").val());
			if (!self.checkContextNull())
				return;
			if (input == "" || input == null) {
				$("#c_tel").removeClass("px error-bor");
				$("#c_tel").addClass("px");
			} else {
				if (!self.phoneCheck(input))
					return;
			}

			var sessionId = sessionStorage.getItem('sessionId');
			$.ajax({
				url : actionInfo.url + this.commentUrl + ";jsessionid=" + sessionId,
				type : "post",
				dataType : "json",
				data : $("form#commentform").serialize(),
				success : function(data, status, xhr) {
					if (data.code == 1) {
						self.windowPop("您的吐槽已经提交成功！");
					} else {
						self.windowPop("哇哇，吐槽失败喽！");
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					self.windowPop("哇哇，吐槽失败喽！");
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
		checkContextNull : function() {
			if ($("#c_context").val().length == 0) {
				$("#c_context").addClass("px error-bor");
				this.windowPop("意见不能为空！");
				return false;
			} else {
				$("#c_context").removeClass("px error-bor");
				$("#c_context").addClass("px");
				return true;
			}
		},
		phoneCheck : function(input) {
			var p1 = /^(13[0-9]\d{8}$|15[012356789]\d{8}$|18[0-9]\{8}$|14[57]\d{8})$/;
			var b = false;
			if (!p1.test(input)) {
				$("#c_tel").addClass("px error-bor");
				this.windowPop("对不起，您输入的手机号码有错误。请输入正确的手机号码。！");
				return false;
			} else {
				$("#c_tel").removeClass("px error-bor");
				$("#c_tel").addClass("px");
				return true;
			}
		},
		selectType : function(obj) {
			type = obj.attr("value");
			this.swicthUserInfoType(type);
		},
		inputContext : function() {
			if ($("#c_context").val().length == 0) {
				$("#c_context").addClass("px error-bor");
			} else {
				$("#c_context").removeClass("px error-bor");
				$("#c_context").addClass("px");
			}
		},
		render : function() {
			this.$el.append(this.template());
			return this;
		}
	});
	return view;
}); 