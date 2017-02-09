define(['jquery', 'underscore', 'backbone', 'iscroll', 'text!modules/helper/operationTesting/viewTemplate.html'], function($, _, Backbone, IScroll, ViewTemplate) {
	var view = Backbone.View.extend({
		template : _.template(ViewTemplate),
		events : {
			"pageshow" : "pageShow",
			"input #operationdeviceIp" : "inputOperationdeviceIp",
			"input #shelf" : "inputShelf",
			"input #frame" : "inputFrame",
			"input #slot" : "inputSlot",
			"input #port" : "inputPort"
		},
		initialize : function(options) {
			this.arrgatherId = ["济南", "青岛", "烟台", "淄博", "临沂", "莱芜", "济宁", "泰安", "德州", "威海", "潍坊", "枣庄", "滨州", "东营", "菏泽", "聊城", "日照"];
			this.cityZhEnId = {"济南":{"En":"jinan","id":"01"}, "青岛":{"En":"qingdao","id":"02"}, "烟台":{"En":"yantai","id":"03"}, "潍坊":{"En":"weifang","id":"04"},
								"淄博":{"En":"zibo","id":"05"}, "泰安":{"En":"taian","id":"06"}, "德州":{"En":"dezhou","id":"07"}, "临沂":{"En":"linyi","id":"08"},
								"枣庄":{"En":"zaozhuang","id":"09"}, "菏泽":{"En":"heze","id":"10"}, "东营":{"En":"dongying","id":"11"},"日照":{"En":"rizhao","id":"12"},
								"莱芜":{"En":"laiwu","id":"13"}, "威海":{"En":"weihai","id":"14"}, "济宁":{"En":"jining","id":"15"}, "滨州":{"En":"binzhou","id":"16"},
								"聊城":{"En":"liaocheng","id":"17"}};
			this.arrsheetTypeId = ["adsl", "lan", "ftth", "fttb"];
			this.urlstr = "http://60.215.133.8:8082/ldims_new/liposs/NetCutover/resource/onekeyactive/OneKeyActiveAction!activeForward.action";
			this.gatherIdValue = "";
			this.sheetTypeValue = "";
			this.cityValue = "";
		},
		pageShow : function() {
			new IScroll('#operationTestingPage .content', {
				preventDefault : false,
				bounceEasing : 'circular',
				bounceTime : 1200
			});
			$(document).bind('touchmove', function(e) {
				e.preventDefault();
			});
			var self = this;
			$("#gatherId").on("tap", function() {
				self.popSelectTypeWin("属地", 1, self.arrgatherId);
			});

			$("#sheetType").on("tap", function() {
				self.popSelectTypeWin("工单类型", 2, self.arrsheetTypeId);
			});

			$("#oSubmit").on("tap", function() {
				self.typeChange(1, $("#gatherId").val());
				self.typeChange(2, $("#sheetType").val());
				self.submitHandler();
			});
		},
		//将页面属地和接入类型转成后台可用值类型
		typeChange : function(type, textValue) {
			if (type == 1) {
				this.gatherIdValue = this.cityZhEnId[textValue].En;
				this.cityValue = this.cityZhEnId[textValue].id;
			} else if (type == 2) {
				switch(textValue) {
				case 'adsl':
					this.sheetTypeValue = "0";
					break;
				case 'lan':
					this.sheetTypeValue = "1";
					break;
				case 'ftth':
					this.sheetTypeValue = "2";
					break;
				case 'fttb':
					this.sheetTypeValue = "3";
					break;
				default:
					this.sheetTypeValue = "0";
					break;
				}
			}
		},
		submitHandler : function() {
			var self = this;
			$.support.cors = true;
			if (!self.iponly())
				return;
			if (!self.checkshelfContextNull())
				return;
			if (!self.checkframeContextNull())
				return;
			if (!self.checkslotContextNull())
				return;
			if (!self.checkportContextNull())
				return;
			var sessionId = sessionStorage.getItem('sessionId');
			$.ajax({
				url : self.urlstr + "?sheetType=" + this.sheetTypeValue + "&cityId=" + this.cityValue + "&ip=" + $("#operationdeviceIp").val() + "&shelf=" + $("#shelf").val() + "&frame=" + $("#frame").val() + "&slot=" + $("#slot").val() + "&port=" + $("#port").val() + "&gatherIdForAD=" + this.gatherIdValue,
				type : "post",
				dataType : "json",
				data : {},
				success : function(data, status, xhr) {
					if (data.code == 1) {
						self.windowPop("运维检测成功！");
					} else {
						self.windowPop("运维检测失败喽！");
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					self.windowPop("运维检测失败喽！");
				}
			});
		},
		checkIPContextNull : function() {
			if ($("#deviceIp").val().length == 0) {
				$("#deviceIp").addClass("px error-bor");
				this.windowPop("ip不能为空！");
				return false;
			} else {
				$("#deviceIp").addClass("px");
				return true;
			}
		},
		iponly : function() {

			var ipAddressNo = $("#operationdeviceIp").val();
			if (/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(ipAddressNo) == false) {
				$("#operationdeviceIp").addClass("px error-bor");
				this.windowPop("请输入正确的IP地址！");
				return false;
			} else {
				$("#operationdeviceIp").removeClass("px error-bor");
				$("#operationdeviceIp").addClass("px");
				return true;
			}
		},
		checkshelfContextNull : function() {
			if ($("#shelf").val().length == 0) {
				$("#shelf").addClass("px error-bor");
				this.windowPop("机架号不能为空！");
				return false;
			} else {
				$("#shelf").removeClass("px error-bor");
				$("#shelf").addClass("px");
				return true;
			}
		},
		checkframeContextNull : function() {
			if ($("#frame").val().length == 0) {
				$("#frame").addClass("px error-bor");
				this.windowPop("机框号不能为空！");
				return false;
			} else {
				$("#frame").removeClass("px error-bor");
				$("#frame").addClass("px");
				return true;
			}
		},
		checkslotContextNull : function() {
			if ($("#slot").val().length == 0) {
				$("#slot").addClass("px error-bor");
				this.windowPop("槽位号不能为空！");
				return false;
			} else {
				$("#slot").removeClass("px error-bor");
				$("#slot").addClass("px");
				return true;
			}
		},
		checkportContextNull : function() {
			if ($("#port").val().length == 0) {
				$("#port").addClass("px error-bor");
				this.windowPop("端口号不能为空！");
				return false;
			} else {
				$("#port").addClass("px");
				return true;
			}
		},
		getObjItem : function(val, type) {
			var str = "";
			switch (type) {
			case 1:
				if ($("#gatherId").val() == val) {
					str = "<li type='1' class='on' value='" + val + "'>" + val + "</li>";
				} else {
					str = "<li type='1' class='' value='" + val + "'>" + val + "</li>";
				}
				break;
			case 2:
				if ($("#sheetType").val() == val) {
					str = "<li type='2' class='on' value='" + val + "'>" + val + "</li>";
				} else {
					str = "<li type='2' value='" + val + "'>" + val + "</li>";
				}
				break;
			default:
				if ($("#gatherId").val() == val) {
					str = "<li type='1' class='on' value='" + val + "'>" + val + "</li>";
				} else {
					str = "<li type='1' class='' value='" + val + "'>" + val + "</li>";
				}
				break;
			}
			return str;
		},
		swicthUserInfoType : function(type, textValue) {
			if (type == 1) {
				$("#gatherId").val(textValue);
			} else if (type == 2) {
				$("#sheetType").val(textValue);
			}
		},
		inputOperationdeviceIp : function() {
			if ($("#operationdeviceIp").val().length == 0) {
				$("#operationdeviceIp").addClass("px error-bor");
			} else {
				$("#operationdeviceIp").removeClass("px error-bor");
				$("#operationdeviceIp").addClass("px");
			}
		},
		inputShelf : function() {
			if ($("#shelf").val().length == 0) {
				$("#shelf").addClass("px error-bor");
			} else {
				$("#shelf").removeClass("px error-bor");
				$("#shelf").addClass("px");
			}
		},
		inputFrame : function() {
			if ($("#frame").val().length == 0) {
				$("#frame").addClass("px error-bor");
			} else {
				$("#frame").removeClass("px error-bor");
				$("#frame").addClass("px");
			}
		},
		inputSlot : function() {
			if ($("#slot").val().length == 0) {
				$("#slot").addClass("px error-bor");
			} else {
				$("#slot").removeClass("px error-bor");
				$("#slot").addClass("px");
			}
		},
		inputPort : function() {
			if ($("#port").val().length == 0) {
				$("#port").addClass("px error-bor");
			} else {
				$("#port").removeClass("px error-bor");
				$("#port").addClass("px");
			}
		},
		//弹出窗口
		popSelectTypeWin : function(title, type, arr) {
			var self = this;
			var htmlStr = "";
			$.each(arr, function(i, val) {
				htmlStr += self.getObjItem(val, type);
			});
			var Win = new WinBox({
				container:self.el,
				html: "<ul>" + htmlStr + "</ul>",
				title:title,
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
		windowPop : function(Str) {
			var Win = new WinBox({
				container:this.el,
				html: "<ul>" + Str + "</ul>",
				title:'提示'
			});
		},
		selectType : function(obj) {
			type = obj.attr("type");
			textValue = obj.attr("value");
			this.swicthUserInfoType(type, textValue);
		},
		render : function() {
			this.$el.append(this.template());
			return this;
		}
	});
	return view;
}); 