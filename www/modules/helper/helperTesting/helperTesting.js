define(['jquery', 'underscore', 'backbone', 'iscroll', 'text!modules/helper/helperTesting/viewTemplate.html'], function($, _, Backbone, IScroll, ViewTemplate) {
	var view = Backbone.View.extend({
		template : _.template(ViewTemplate),
		events : {
			"pageshow" : "pageShow",
			"input #testdeviceIp" : "inputTestdeviceIp"
		},
		initialize : function(options) {
			this.arrgatherId = ["济南", "青岛", "烟台", "淄博", "临沂", "莱芜", "济宁", "泰安", "德州", "威海", "潍坊", "枣庄", "滨州", "东营", "菏泽", "聊城", "日照"];
			this.cityZhEn = {"济南":"jinan", "青岛":"qingdao", "烟台":"yantai", "淄博":"zibo", "临沂":"linyi", "莱芜":"laiwu", "济宁":"jining", 
								"泰安":"taian", "德州":"dezhou", "威海":"weihai", "潍坊":"weifang", "枣庄":"zaozhuang", "滨州":"binzhou", 
								"东营":"dongying", "菏泽":"heze", "聊城":"liaocheng", "日照":"rizhao"};
			this.arrpackageSum = ["64 byte", "128 byte", "256 byte", "512 byte", "1024 byte", "1280 byte", "1518 byte"];
			this.arrpackageNum = ["5", "20", "50", "100"];
			this.urlstr = "http://60.215.133.8:8082/ldims_new/liposs/snmptest/pingAppTestAction!pingAppTest.action";
			this.gatherIdValue = "";
			this.packageSumValue = "";
			this.packageNumValue = "";
		},
		pageShow : function() {
			new IScroll('#helperTestingPage .content', {
				preventDefault : false,
				bounceEasing : 'circular',
				bounceTime : 1200
			});
			$(document).bind('touchmove', function(e) {
				e.preventDefault();
			});
			var self = this;
			//$("#pingTesingSubmit").focus();
			$("#gatherId").on("tap", function() {
				self.popSelectTypeWin("属地", 1, self.arrgatherId);
			});

			$("#packageSum").on("tap", function() {
				self.popSelectTypeWin("数据包大小", 2, self.arrpackageSum);
			});

			$("#packageNum").on("tap", function() {
				self.popSelectTypeWin("数据包数目", 3, self.arrpackageNum);
			});

			$("#pingTesingSubmit").on("tap", function() {
				self.typeChange(1, $("#gatherId").val());
				self.typeChange(2, $("#packageSum").val());
				self.typeChange(3, $("#packageNum").val());
				self.pingsubmitHandler();
			});

			$("#traceRouteSubmit").on("tap", function() {
				self.typeChange(1, $("#gatherId").val());
				self.typeChange(2, $("#packageSum").val());
				self.typeChange(3, $("#packageNum").val());
				self.traceRoutesubmitHandler();
			});
		},
		typeChange : function(type, textValue) {
			this.gatherIdValue = 'jinan';
			this.packageSumValue = '512';
			this.packageNumValue = '20';
			if(textValue)
			{
				if (type == 1) {
					this.gatherIdValue = this.cityZhEn[textValue];
				} else if (type == 2) {
					this.packageSumValue = textValue.replace(' byte','');
				} else if (type == 3) {
					this.packageNumValue = textValue;
				}
			}
		},
		pingsubmitHandler : function() {
			var self = this;
			$.support.cors = true;
			if (!self.iponly())
				return;
			var sessionId = sessionStorage.getItem('sessionId');
			$.ajax({
				url : self.urlstr + "?deviceIp=" + $("#testdeviceIp").val() + "&gatherId=" + this.gatherIdValue,
				type : "post",
				dataType : "json",
				data : {},
				success : function(data, status, xhr) {
					if (data.code == 1) {
						self.windowPop("Ping检测成功！");
						var infoDivStr = "&nbsp&nbsp" + data.value.receivebuf.replace(new RegExp("\n", 'g'), "<br/>&nbsp&nbsp");
						var infoStr = "<div id='mianDiv'><h4 class='info_title'> Ping检测结果:</h4>" + "<table class='tab_main' style='margin-bottom:5px' width='100%' border='0' cellspacing='0' cellpadding='0'>" + "<tbody><tr><td style='width:150px'>MAX</td><td>" + data.value.max + "</td></tr><tr><td>MIN</td><td>" + data.value.min + "</td></tr><tr><td>AVG</td><td>" + data.value.avg + "</td></tr><tr><td>MDEV</td><td>" + data.value.mdev + "</td></tr><tr><td>总耗时</td><td>" + data.value.totalCostTime + "</td> </tr><tr><td>耗时</td><td>" + data.value.timeCostList + "</td></tr><tr><td>发送次数</td><td>" + data.value.sendPacketNum + "</td></tr><tr><td>接受成功数</td><td>" + data.value.succNum + "</td></tr><tr><td>包大小</td><td>" + data.value.packetSize + "</td></tr><tr><td>丢包率</td><td>" + data.value.packetLossRate + "</td></tr></tbody></table><h4 class='info_title'>详情信息：</h4>" + "<div>" + infoDivStr + "</div></div>";

						$(".infoDivtestClass").html(infoStr);
					} else {
						self.windowPop("Ping检测失败喽！");
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					self.windowPop("Ping检测失败喽！");
				}
			});
		},
		traceRoutesubmitHandler : function() {
			var self = this;
			$.support.cors = true;
			if (!checkIPContextNull())
				return;
			var sessionId = sessionStorage.getItem('sessionId');
			$.ajax({
				url : self.urlstr + "?deviceIp=" + $("#testdeviceIp").val() + "&gatherId=" + this.gatherIdValue,
				type : "post",
				dataType : "json",
				data : {},
				success : function(data, status, xhr) {
					if (data.code == 1) {
						self.windowPop("Ping检测成功！");
					} else {
						self.windowPop("Ping检测失败喽！");
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					self.windowPop("Ping检测失败喽！");
				}
			});
		},
		checkIPContextNull : function() {
			if ($("#testdeviceIp").val().length == 0) {
				$("#testdeviceIp").addClass("px error-bor");
				this.windowPop("ip不能为空！");
				return false;
			} else {
				$("#testdeviceIp").addClass("px");
				return true;
			}
		},
		iponly : function() {

			var ipAddressNo = $("#testdeviceIp").val();
			if (/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(ipAddressNo) == false) {
				$("#testdeviceIp").addClass("px error-bor");
				this.windowPop("请输入正确的IP地址！");
				return false;
			} else {
				$("#testdeviceIp").remove("px error-bor");
				$("#testdeviceIp").addClass("px");
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
				str = "<li type='2' value='" + val + "'>" + val + "</li>";
				break;
			case 3:
				str = "<li type='3' value='" + val + "'>" + val + "</li>";
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
				$("#packageSum").val(textValue);
			} else if (type == 3) {
				$("#packageNum").val(textValue);
			}
		},
		inputTestdeviceIp : function() {
			if ($("#testdeviceIp").val().length == 0) {
				$("#testdeviceIp").addClass("px error-bor");
			} else {
				$("#testdeviceIp").removeClass("px error-bor");
				$("#testdeviceIp").addClass("px");
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