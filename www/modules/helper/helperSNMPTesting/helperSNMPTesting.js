define(['jquery', 'underscore', 'backbone', 'iscroll', 'text!modules/helper/helperSNMPTesting/viewTemplate.html'], function($, _, Backbone, IScroll, ViewTemplate) {
	var view = Backbone.View.extend({
		template : _.template(ViewTemplate),
		events : {
			"pageshow" : "pageShow",
			"input #snmpdeviceIp" : "inputSnmpdeviceIp",
			"input #readCommand" : "inputReadCommand",
			"input #writeCommand" : "inputWriteCommand"
		},
		initialize : function(options) {
			this.arrgatherId = ["济南", "青岛", "烟台", "淄博", "临沂", "莱芜", "济宁", "泰安", "德州", "威海", "潍坊", "枣庄", "滨州", "东营", "菏泽", "聊城", "日照"];
			this.cityZhEn = {"济南":"jinan", "青岛":"qingdao", "烟台":"yantai", "淄博":"zibo", "临沂":"linyi", "莱芜":"laiwu", "济宁":"jining", 
								"泰安":"taian", "德州":"dezhou", "威海":"weihai", "潍坊":"weifang", "枣庄":"zaozhuang", "滨州":"binzhou", 
								"东营":"dongying", "菏泽":"heze", "聊城":"liaocheng", "日照":"rizhao"};
			this.cityEnZh = {"jinan":"济南", "qingdao":"青岛", "yantai":"烟台", "zibo":"淄博", "linyi":"临沂", "laiwu":"莱芜", "jining":"济宁", 
								"taian":"泰安", "dezhou":"德州", "weihai":"威海", "weifang":"潍坊", "zaozhuang":"枣庄", "binzhou":"滨州", 
								"dongying":"东营", "heze":"菏泽", "liaocheng":"聊城", "rizhao":"日照"};
			this.urlstr = "http://60.215.133.8:8082/ldims_new/liposs/snmptest/snmpTest!snmpTest.action";
			this.gatherIdValue = "";
			this.gatherIdValueZN = "";
		},
		pageShow : function() {
			new IScroll('#helperSNMPTPage .content', {
				preventDefault : false,
				bounceEasing : 'circular',
				bounceTime : 1200
			});
			$(document).bind('touchmove', function(e) {
				e.preventDefault();
			});
			var self = this;
			$("#snmpSubmit").focus();
			$("#gatherId").on("tap", function() {
				self.popSelectTypeWin();
			});

			$("#snmpSubmit").on("tap", function() {
				self.typeChange(1, $("#gatherId").val());
				self.submitHandler();
			});
		},
		//将页面属地和接入类型转成后台可用值类型
		typeChange : function(type, textValue) {
			if (type == 1) {
				this.gatherIdValue = this.cityZhEn[textValue];
			} else if (type == 2) {
				switch(textValue) {
				case 'AD':
					userTypeValue = "10";
					break;
				case 'LAN':
					userTypeValue = "11";
					break;
				case 'PON':
					userTypeValue = "12";
					break;
				default:
					userTypeValue = "10";
				}
			}
		},
		typeChangeZn : function(textValue) {
			return this.cityEnZh[textValue];
		},
		submitHandler : function() {
			var self = this;
			$.support.cors = true;
			if (!self.iponly())
				return;
			if (!self.checkRContextNull())
				return;
			if (!self.checkWContextNull())
				return;
			var sessionId = sessionStorage.getItem('sessionId');
			$.ajax({
				url : self.urlstr + "?gatherId=" + this.gatherIdValue + "&deviceIp=" + $("#snmpdeviceIp").val() + "&readCommand=" + $("#readCommand").val() + "&writeCommand=" + $("#writeCommand").val(),
				type : "post",
				dataType : "json",
				data : {},
				success : function(data, status, xhr) {
					var str = "";
					if (data.read == "成功") {
						str += "SNMP-读口令检测成功！<br>";
						var infoStr = "<div id='mianDiv'><h4 class='info_title'> SNMP检测结果:</h4>" + "<table class='tab_main' style='margin-bottom:5px' width='100%' border='0' cellspacing='0' cellpadding='0'>" + "<tbody><tr><td>设备IP</td><td>" + data.deviceIp + "</td></tr><tr><td>属地</td><td>" + typeChangeZn(data.gatherId) + "</td></tr><tr><td>读口令</td><td>" + data.read + "</td> </tr><tr><td>写口令</td><td>" + data.write;
						+"</td></tr></tbody></table></div>";

						$(".infosnmpDivClass").html(infoStr);
					} else {
						str += "SNMP-读口令检测失败！<br>";
					}

					if (data.write == "成功") {
						str += "SNMP-写口令检测成功！";
						self.windowPop(str);
					} else {
						str += "SNMP-写口令检测失败！";
						self.windowPop(str);
					}
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					self.windowPop("SNMP检测失败喽！");
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
			var ipAddressNo = $("#snmpdeviceIp").val();
			if (/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(ipAddressNo) == false) {
				$("#snmpdeviceIp").addClass("px error-bor");
				this.windowPop("请输入正确的IP地址！");
				return false;
			} else {
				$("#snmpdeviceIp").removeClass("px error-bor");
				$("#snmpdeviceIp").addClass("px");
				return true;
			}
		},
		checkRContextNull : function() {
			if ($("#readCommand").val().length == 0) {
				$("#readCommand").addClass("px error-bor");
				this.windowPop("读口令不能为空！");
				return false;
			} else {
				$("#readCommand").removeClass("px error-bor");
				$("#readCommand").addClass("px");
				return true;
			}
		},
		checkWContextNull : function() {
			if ($("#writeCommand").val().length == 0) {
				$("#writeCommand").addClass("px error-bor");
				this.windowPop("写口令不能为空！");
				return false;
			} else {
				$("#writeCommand").removeClass("px error-bor");
				$("#writeCommand").addClass("px");
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
				if ($("#userType").val() == val) {
					str = "<li type='2' class='on' value='" + val + "'>" + val + "</li>";
				} else {
					str = "<li type='2' class='' value='" + val + "'>" + val + "</li>";
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
			} 
			else if (type == 2) {
				$("#userType").val(textValue);
			}
		},
		inputSnmpdeviceIp : function() {
			if ($("#snmpdeviceIp").val().length == 0) {
				$("#snmpdeviceIp").addClass("px error-bor");
			} else {
				$("#snmpdeviceIp").removeClass("px error-bor");
				$("#snmpdeviceIp").addClass("px");
			}
		},
		inputReadCommand : function() {
			if ($("#readCommand").val().length == 0) {
				$("#readCommand").addClass("px error-bor");
			} else {
				$("#readCommand").removeClass("px error-bor");
				$("#readCommand").addClass("px");
			}
		},
		inputWriteCommand : function() {
			if ($("#writeCommand").val().length == 0) {
				$("#writeCommand").addClass("px error-bor");
			} else {
				$("#writeCommand").removeClass("px error-bor");
				$("#writeCommand").addClass("px");
			}
		},
		//弹出窗口
		popSelectTypeWin : function() {
			var htmlStr = "";
			var self = this;
			$.each(this.arrgatherId, function(i, val) {
				htmlStr += self.getObjItem(val);
			});
			var Win = new WinBox({
                container:self.el,
				html: "<ul>" + htmlStr + "</ul>",
				title:"属地",
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