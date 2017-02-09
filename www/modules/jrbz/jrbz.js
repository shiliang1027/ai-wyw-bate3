/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone', 'iscroll',
		'http://res.wx.qq.com/open/js/jweixin-1.0.0.js',
		'text!modules/jrbz/viewTemplate.html',
		'text!modules/jrbz/tabsViewTemplate.html',
		'modules/jrbz/sha1'], 
function ($, _, Backbone, IScroll, jWeixin,viewTemplate,tabsViewTemplate) {
	var View1 = Backbone.View.extend({
		template: _.template(tabsViewTemplate),
		events : {
		},
		initialize : function(options) {
		},
		render : function(data,obj) {
			this.$el = obj || this.$el;
			this.$el.html(this.template(data));
			this.delegateEvents();
			return this;
		}
	});
    
    var View = Backbone.View.extend({
        template: _.template(viewTemplate),
        events: {
            "pageshow":"pageShow",
            "pagehide":"pageHide",
            "click .share_btn":"shareWin",
            "click .share_win .close":"closeWin",
            "click #shareWeixin":'onMenuShareWeixin',
            "click #shareTimeline":'onMenuShareTimeline',
            "click #shareQQ":'onMenuShareQQ',
            "click #shareEmail":'onMenuShareEmail'
        },
        initialize: function (options) {
			this.timeList = null; // 获取时间列表
			this.type; // 指数查询类别 1 日 2周 3月
			this.time; // 指数查询时间
			this.timevalue; // 指数查询时间
			this.gid; // 指数查询类别
			this.objTime = {"date" : "切换日","week" : "切换周","month" : "切换月"};
			this.retObj = null; // 查询返回的当前数据
			this.charts = [];
			this.view1 = new View1();
			this.gid = "50";
			this.type = "1";
        },
        pageHide:function(){
            console.info("page hide...");
            this.clearCharts();
        },
        pageShow:function(){
        	var self = this;
			$(document).bind('touchmove', function(e) {
				e.preventDefault();
			});
			$("#searchTypeJrbz").children("li").each(function() {
				$(this).on("tap", function() {
					// 当前类别不用重复查询
					if ($(this).attr("class") == "on") {
						return;
					}
					$(this).addClass("on").siblings().removeClass("on");
					self.gid = $(this).attr("gid");
					self.getHolData();
					self.clearCharts();
				});
			});
			$('.calendar_tab').children("li").each(function() {
				$(this).on("tap", function() {
					$(this).addClass("on").siblings().removeClass("on");
					self.onChangeDate($(this).attr("time"));
				});
			});
   			self.getKpiTimeList();
			//self.getWeiXinTicket();
        },
        getWeiXinTicket:function(){
        	var self = this;
			$.ajax({
				url: actionInfo.url + actionInfo.getWeiXinTicket,
				type: "post",
				dataType: "json",
				async: false,
				success: function (data) {
					var timestamp = Math.round(new Date().getTime()/1000);
					var signature = hex_sha1("jsapi_ticket="+data.ticket+"&nonceStr=sdzhjk2016&timestamp="+timestamp+"&url=www.baidu.com");
					jWeixin.config({
						debug: true,
					    appId: 'wx622e470a3429ef12', // 必填，公众号的唯一标识
					    timestamp: timestamp, // 必填，生成签名的时间戳
					    nonceStr: 'sdzhjk2016', // 必填，生成签名的随机串
					    signature: signature,// 必填，签名，见附录1
					    jsApiList: ['checkJsApi','onMenuShareTimeline','onMenuShareAppMessage', 'onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});			
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
				}
			});
        },
        onMenuShareTimeline:function(){
        	jWeixin.onMenuShareTimeline({
			    title: '分享到朋友圈', // 分享标题
			    link: 'www.baidu.com', // 分享链接
			    imgUrl: '', // 分享图标
			    success: function () { 
			        // 用户确认分享后执行的回调函数
			    },
			    cancel: function () { 
			        // 用户取消分享后执行的回调函数
			    }
			});
        },
        onMenuShareWeixin:function(){
        	jWeixin.ready(function () {
	        	jWeixin.onMenuShareAppMessage({
				    title: '分享到微信', // 分享标题
				    desc: '分享到微信', // 分享描述
				    link: 'www.baidu.com', // 分享链接
				    //imgUrl: '', // 分享图标
				    //type: '', // 分享类型,music、video或link，不填默认为link
				    //dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				    success: function () { 
				        console.log("成功分享到微信");
				    },
				    cancel: function () { 
				        console.log("取消分享到微信");
				    },
				    fail: function (res) {
	                	console.log("errorMSG:" + res);
	            	}
				});
				jWeixin.error(function(res){
		            alert("errorMSG:" + res);
		        });

			});
        },
        onMenuShareQQ:function(){
        	jWeixin.onMenuShareQQ({
			    title: '分享到QQ', // 分享标题
			    desc: '分享到QQ', // 分享描述
			    link: 'www.baidu.com', // 分享链接
			    imgUrl: '', // 分享图标
			    success: function () { 
			       // 用户确认分享后执行的回调函数
			    },
			    cancel: function () { 
			       // 用户取消分享后执行的回调函数
			    }
			});
        },
        onMenuShareEmail:function(){
        	
        },
        clearCharts:function(){
        	$.each(this.charts,function(i,n){
            	try{
            		n.clear();
                	n.dispose();
            	}catch(e){}
            });
            this.charts= [];
        },
        getKpiTimeList : function(timeList) {
        	var self = this;
			$.ajax({
				url: actionInfo.url + actionInfo.getTimeList,
				type: "post",
				dataType: "json",
				data: {},
				success: function (data, status, xhr) {
					if (data.code == 1) {
						self.timeList = data;
						self.dayNow = self.timeList.value.date.now;
						self.time = self.dayNow;
						self.timevalue = self.dayNow;
						self.getHolData();
					}
					else {
						reLogin();
					}
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					reLogin();
				}
			});
		},
        getObjItem : function(type, val) {
			var str = "";
			switch (type) {
	            case "date":
	                if (this.timevalue == val) {
	                    str = "<li type='1'class='on' time='" + val + "'>"
	                            + parseInt(val.substr(5, 2)) + "月"
	                            + parseInt(val.substr(8)) + "日<br/>"
	                            + parseInt(val.substr(0, 4)) + "</li>";
	                } else {
	                    str = "<li type='1'class='' time='" + val + "'>"
	                            + parseInt(val.substr(5, 2)) + "月"
	                            + parseInt(val.substr(8)) + "日<br/>"
	                            + parseInt(val.substr(0, 4)) + "</li>";
	                }
	                break;
	            case "week":
	                if (this.timevalue == val) {
	                    str = "<li type='2' class='on' time='" + val + "'>"
	                            + parseInt(val.substr(5)) + "周<br/>"
	                            + parseInt(val.substr(0, 4)) + "</li>";
	                } else {
	                    str = "<li type='2' time='" + val + "'>" + parseInt(val.substr(5))
	                            + "周<br/>" + parseInt(val.substr(0, 4)) + "</li>";
	                }
	                break;
	            case "month":
	                if (this.timevalue == val) {
	                    str = "<li type='3' class='on' time='" + val + "'>"
	                            + parseInt(val.substr(5)) + "月<br/>"
	                            + parseInt(val.substr(0, 4)) + "</li>";
	                } else {
	                    str = "<li type='3' time='" + val + "'>" + parseInt(val.substr(5))
	                            + "月<br/>" + parseInt(val.substr(0, 4)) + "</li>";
	                }
	                break;
	            default:
	                break;
            }
			return str;
		},
		/**
		 * 组织切换时间弹出
		 */
		onChangeDate : function(time) {
			var self = this;
			var arr = self.timeList.value[time].list;
			var htmlStr = "";
			$.each(arr, function(i, val) {
				htmlStr += self.getObjItem(time, val);
			});
			
			var Win = new WinBox({
				container:self.el,
				html: "<ul>" + htmlStr + "</ul>",
				title:self.objTime[time],
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
		getHolData : function() {
			// gid=50移动核心网，51互联网，52无线网
			// timetype=,time=
			var self = this;
			self.retObj = null;
			$.ajax({
				url : actionInfo.url + actionInfo.getHolidayData,
				type : "post",
				dataType : "json",
				data : {
					"gid" : self.gid,
					"params" : "timeType=" + self.type + ",time=" + self.time
				},// "params": "timeType=1,time=2015-02-24", "jsessionid": sessionId},
				success : function(data, status, xhr) {
					self.retObj = data.value;
					if (!self.retObj || self.retObj.length == 0) {
						return;
					}
					var objs = {};
					for ( var i = 0; i < self.retObj.length; i++) {
						var val = self.retObj[i];
						if (self.isNull(val.dataMap) || !val.dataMap.list
								|| val.dataMap.list.length == 0) {
							continue;
						}
						var obj = val.dataMap.list[0];
						var repTime= obj.REPORT_TIME + "";
						if(val.id == 37)
						{
							obj = self.arrSort(val.dataMap.list);
							repTime = obj.arr[0].REPORT_TIME + "";
						}
						if(val.id == 35)
						{
							obj.timeshow = repTime.substring(0, 4) + "年" + repTime.substring(5, 7) + "月" + repTime.substring(8) + "日";
						}
						else
						{
							obj.timeshow = repTime.substring(0, 4) + "年" + repTime.substring(4, 6) + "月" + repTime.substring(6) + "日";
						}
						
						objs[val.id] = obj;
					}
					self.view1.render({type:self.gid,objs:objs},$('.testing_content'));
					
					for ( var i = 0; i < self.retObj.length; i++) {
						var val = self.retObj[i];
						if (self.isNull(val.dataMap) || !val.dataMap.list
								|| val.dataMap.list.length == 0) {
							continue;
						}
						switch (val.id) {
							case 32: // "移动网全天业务量"
								self.buildType1(objs[val.id], val.name);
								break;
							case 33: // "移动网忙时业务量"
								self.buildType2(objs[val.id], val.name);
								break;
							case 34: // "移动网负荷"
								self.buildType3(objs[val.id], val.name);
								break;
							case 35: // "互联网在线用户数"
								self.buildType4(objs[val.id], val.name);
								break;
							case 36: // "城域网出口流量业务占比"
								self.buildType5(objs[val.id], val.name);
								break;
							case 37: // "互联网网站访问量排名"
								self.buildType6(objs[val.id], val.name);
								break;
							case 38: // "互联网负荷"
								self.buildType7(objs[val.id], val.name);
								break;
							case 39: // "高铁动车"
								self.buildType8(objs[val.id], val.name);
								break;
							case 40: // "交通枢纽"
								self.buildType9(objs[val.id], val.name);
								break;
							default:
								break;
						}
					}
					setTimeout(function() {
						new IScroll('.testing_content', {
							preventDefault : false,
							bounceEasing : 'circular',
							bounceTime : 1200
						});
					}, 500);
				},
				error : function(XMLHttpRequest, textStatus, errorThrown) {
					reLogin();
				}
			});
		},
		/**
		 * object 为undefined,null,{}的验证
		 */
		isNull : function(obj) { 
			if (!obj) {
				return true;
			}
		    for (var name in obj) { 
		        return false; 
		    } 
		    return true; 
		},
		/**
		 * kpi指数 统计折线图
		 */
		buildType1 : function(obj, name) {
			var self = this;
			var nameY = "单位";
			if (obj['2G'] > 10000 || obj['3G'] > 10000 || obj['2G_AVG'] > 10000
					|| obj['3G_AVG'] > 10000) {
				nameY += "(万)";
			}
			
			require([ 'echarts3/echarts.min'], function(ec) {
				var myChart = ec.init(document.getElementById("type1"));
				self.charts.push(myChart);
				option = {
					title : {
						text : '全天业务量'
					},
					tooltip : {
						trigger : 'axis',
						axisPointer : {
							type : 'shadow'
						}
					},
					legend : {
						x : 'center',
						y : 'top',
						data : ['话务量','均值'],
						textStyle : {
							fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
							fontWeight : 'normal'
						}
					},
					toolbox : {
						show : false,
						padding : [ 5, 20, 5, 5 ],
						feature : {
							// mark: {show: true},
							// dataView: {show: true, readOnly: false},
							restore : {
								show : true
							}
						// saveAsImage: {show: true}
						}
					},
					calculable : false,
		            animation:false,
					grid : {
						y : 60,
						y2 : 40,
						x2 : 20,
						x : 40
					},
					xAxis : [ {
						type : 'category',
						data : [ "2G话务量(ERL)", "3G话务量(ERL)" ],
						axisLabel : {
							textStyle : {
								fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
								fontWeight : 'normal'
							// fontSize: 18
							}
						},
						splitLine : {
							show : false
						},
						axisLine : {
							lineStyle : {
								color : '#cccccc'
							}
						}
					} ],
					yAxis : [ {
						name : nameY,
						type : 'value',
						axisLabel : {
							formatter : function(value) {
								if (nameY.indexOf("万") != -1) {
									return value / 10000;
								} else {
									return value;
								}
							},
							textStyle : {
								fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
								fontWeight : 'normal'
							// fontSize: 14
							}
						},
						axisLine : {
							lineStyle : {
								color : '#cccccc'
							}
						}
					} ],
					series : [ {
						name : '话务量',
		                barWidth : 40,
						type : 'bar',
						//barGap : 30,
						data : [ obj['2G'], obj['3G'] ]
					}, {
						name : '均值',
						barWidth : 40,
						type : 'bar',
						//barGap : 30,
						data : [ obj['2G_AVG'], obj['3G_AVG'] ]
					} ]
				};
				myChart.setOption(option);
			});
		},
		buildType2 : function(obj, name) {
			var self = this;
			
			require([ 'echarts3/echarts.min'], function init_busy_radar_char(ec){
				var myChart_busy_radar = ec.init(document.getElementById("type2"));
				self.charts.push(myChart_busy_radar);
				var option_busy_radar = {
					    title : {
					        text: '忙时业务量'
					    },
					    tooltip : {
					        trigger: 'axis'
					    },
					    legend: {
					    	orient : 'vertical',
							x : 'right',
							y : 'bottom',
					        data:[obj.timeshow, '均值']
					    },
					    polar : [
					       {
					    	   name : {
									show : true,
									formatter : null,
									textStyle : {
										fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
										fontWeight : 'normal',
										fontSize : 10
									},
									margin : 5
		
								},
					           indicator : [
								   { text: '2G用户数(户)'},
								   { text: '3G用户数(户)'},
								   { text: '4G用户数(户)'},
					               { text: '2G话务量(ERL)'},
					               { text: '3G话务量(ERL)'},
					               { text: '2G流量(GB)'},
					               { text: '3G流量(GB)'},
					               { text: '4G流量(GB)'}
					            ],
					            radius : 70
					        }
					    ],
					    calculable : false,
					    animation:false,
					    series : [
					        {
					            name: name,
					            type: 'radar',
					            data : [
										{
											value : [  parseInt(obj['2G_USER']),  
											           parseInt(obj['3G_USER']),
											           parseInt(obj['4G_USER']),  
											           parseInt(obj['2G_HUAWU']),
											           parseInt(obj['3G_HUAWU']),  
											           parseInt(obj['2G_LIU']),
											           parseInt(obj['3G_LIU']),  
											           parseInt(obj['4G_LIU']) ],
											name : obj.timeshow
										},
										{
											value : [  parseInt(obj['2G_USER_AVG']),
											           parseInt(obj['3G_USER_AVG']),
											           parseInt(obj['4G_USER_AVG']),  
											           parseInt(obj['2G_HUAWU_AVG']),
									        		   parseInt(obj['3G_HUAWU_AVG']),  
									        		   parseInt(obj['2G_LIU_AVG']),
									        		   parseInt(obj['3G_LIU_AVG']),  
									        		   parseInt(obj['4G_LIU_AVG']) ],
											name : '均值'
										} ]
					        }
					    ]
					};
				myChart_busy_radar.setOption(option_busy_radar);
				window.onresize = myChart_busy_radar.resize;
			});
		},
		buildType3 : function(obj, name) {
			var self = this;
			
			require([ 'echarts3/echarts.min'], function(ec) {
				var myChart = ec.init(document.getElementById("type3"));
				self.charts.push(myChart);
				var option = {
					title : {
						text : name
					},
					tooltip : {
						trigger : 'axis',
						axisPointer : {
							type : 'shadow'
						}
					},
					toolbox : {
						show : false,
						padding : [ 5, 20, 5, 5 ],
						feature : {
							// mark: {show: true},
							// dataView: {show: true, readOnly: false},
							restore : {
								show : true
							}
						// saveAsImage: {show: true}
						}
					},
					calculable : false,
		            animation:false,
					grid : {
						y : 60,
						y2 : 40,
						x2 : 20,
						x : 40
					},
					xAxis : [ {
						type : 'category',
						data : [ "移动网VLR利用率", "移动网SERVER CPU负荷" ],
						axisLabel : {
							textStyle : {
								fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
								fontWeight : 'normal'
							// fontSize: 16
							}
						},
						splitLine : {
							show : false
						},
						axisLine : {
							lineStyle : {
								color : '#cccccc'
							}
						}
					} ],
					yAxis : [ {
						name : '单位(%)',
						type : 'value',
						axisLabel : {
							textStyle : {
								fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
								fontWeight : 'normal'
							// fontSize: 14
							}
						},
						axisLine : {
							lineStyle : {
								color : '#cccccc'
							}
						}
					} ],
					series : [ {
						barWidth : 40,
						text : name,
						type : 'bar',
						barGap : 70,
						data : [ obj['COREVLR'], obj['CORESERVERCPU'] ]
					} ]
				};
				myChart.setOption(option);
			});
		},
		buildType4 : function(obj, name) {
			var self = this;
			var repTime= obj.REPORT_TIME + "";
			var nameY = "用户数";
			if (obj['ONLINE_NUM_20G'] > 10000 || obj['ONLINE_AVG'] > 10000) {
				nameY += "(万户)";
			} else {
				nameY += "(户)";
			}
			
			require([ 'echarts3/echarts.min'], function(ec) {
				var myChart = ec.init(document.getElementById("type4"));
				self.charts.push(myChart);
				var option = {
					title : {
						text : name
					},
					tooltip : {
						trigger : 'axis',
						axisPointer : {
							type : 'shadow'
						}
					},
					legend : {
						x : 'center',
						y : 'bottom',
						data : [ '在线用户数(户)', '在线用户比(%)' ],
						textStyle : {
							fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
							fontWeight : 'normal'
						}
					},
					toolbox : {
						show : false,
						padding : [ 5, 20, 5, 5 ],
						feature : {
							// mark: {show: true},
							// dataView: {show: true, readOnly: false},
							restore : {
								show : true
							}
						// saveAsImage: {show: true}
						}
					},
					calculable : false,
		            animation:false,
					grid : {
						y : 60,
						y2 : 50,
						x2 : 40,
						x : 50
					},
					xAxis : [ {
						type : 'category',
						data : [ repTime.replace(/[-]/, '.'), "均值" ],
						axisLabel : {
							textStyle : {
								fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
								fontWeight : 'normal'
							}
						},
						splitLine : {
							show : false
						},
						axisLine : {
							lineStyle : {
								color : '#cccccc'
							}
						}
					} ],
					yAxis : [ {
						name : '用户数(万户)',
						type : 'value',
						axisLabel : {
							formatter : function(value) {
								if (nameY.indexOf("万") != -1) {
									return value / 10000;
								} else {
									return value;
								}
							},
							textStyle : {
								fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
								fontWeight : 'normal'
							}
						},
						axisLine : {
							lineStyle : {
								color : '#cccccc'
							}
						}
					}, {
						name : '用户占比(%)',
						type : 'value',
						axisLabel : {
							textStyle : {
								fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
								fontWeight : 'normal'
							}
						},
						axisLine : {
							lineStyle : {
								color : '#cccccc'
							}
						}
					} ],
					series : [ {
						name : '在线用户数(户)',
						type : 'bar',
						barMaxWidth : 40,
						data : [ obj['ONLINE_NUM_20G'], obj['ONLINE_AVG'] ]
					}, {
						name : '在线用户比(%)',
						type : 'line',
						data : [ obj['USER_ONLINE_RATE_20G'], obj['ONLINE_RATE_AVG'] ],
						yAxisIndex : 1
					} ]
				};
				myChart.setOption(option);
			});
		},
		buildType5 : function(obj, name) {
			var self = this;
			
			require(
					[ 'echarts3/echarts.min'],
					function(ec) {
						var myChart = ec.init(document.getElementById("type5"));
						self.charts.push(myChart);
						var option = {
							title : {
								itemGap : 8,
								textStyle : {
									fontWeight : 'normal',
									// color: '#008acd' // 主标题文字颜色
									color : '#000000'
								},
								text : "出向流量业务占比"
		
							},
							tooltip : {
								trigger : 'item',
								formatter : "{a} <br/>{b} : {c} ({d}%)"
							},
							legend : {
								x : 'center',
								y : 'bottom',
								data : [ 'BT下载', '域名服务', 'FTP', '游戏', '邮件', 'PPS',
										'PPTV', '腾讯视频', '迅雷视频', '网页浏览' ],
								textStyle : {
									fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
									fontWeight : 'normal'
								}
							},
							toolbox : {
								show : false,
								padding : [ 5, 20, 5, 5 ],
								feature : {
									restore : {
										show : true
									}
								// saveAsImage : {show: true}
								}
							},
							calculable : false,
							animation : false,
							// grid: {
							// y: 60,
							// y2: 40,
							// x2: 20,
							// x: 40
							// },
							series : [ {
								name : obj.timeshow + "出向流量业务占比",
								type : 'pie',
								radius : [ 40, 70 ],
								data : [ {
									value : obj['BT'],
									name : 'BT下载',
									itemStyle : {
										label : {
											show : false,
											position : 'outer'
										}
									}
								}, {
									value : obj['DOMAIN'],
									name : '域名服务'
								}, {
									value : obj['FTP'],
									name : 'FTP'
								}, {
									value : obj['GAME'],
									name : '游戏'
								}, {
									value : obj['MAIL'],
									name : '邮件'
								}, {
									value : obj['PPS'],
									name : 'PPS'
								}, {
									value : obj['PPTV'],
									name : 'PPTV'
								}, {
									value : obj['TENCENT'],
									name : '腾讯视频'
								}, {
									value : obj['THUND'],
									name : '迅雷视频'
								}, {
									value : obj['WEBSEE'],
									name : '网页浏览'
								} ]
							} ]
						};
						myChart.setOption(option);
					});
		},
		/**
		 * 数组排序 arr 排序数组 retrun obj
		 */
		arrSort : function(arr) {
			var len = arr.length;
			var retArr = new Array(len);
			var retArrX = new Array(len);
			var retArrY = new Array(len);
			$.each(arr, function(i, val) {
				retArr.splice(len - val.RANK_NOW, 1, val);
				retArrX.splice(len - val.RANK_NOW, 1, val.ACCESS_NUM);
				retArrY.splice(len - val.RANK_NOW, 1, val.SITE_NAME);
			});
			return {
				"arr" : retArr,
				"x" : retArrX,
				"y" : retArrY
			};
		},
		buildType6 : function(obj, name) {
			var self = this;
			
			require([ 'echarts3/echarts.min'], function(ec) {
				var myChart = ec.init(document.getElementById("type6"));
				self.charts.push(myChart);
				// var myChart = ec.init(document.getElementById('type6'),e_macarons);
				var option = {
					// title : {
					// text: "网站访问量"
					// },
					tooltip : {
						trigger : 'axis',
						axisPointer : {
							type : 'shadow'
						}
					},
					legend : {
						data : [ {
							name : '网站访问量',
							textStyle : {
								fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
								fontWeight : 'normal'
							// fontSize: 18
		
							}
						} ]
					},
					grid : {
						y : 60,
						y2 : 40,
						x2 : 20,
						x : 60
					},
					toolbox : {
						show : false,
						padding : [ 5, 20, 5, 5 ],
						feature : {
							magicType : {
								show : true,
								type : [ 'line', 'bar' ]
							},
							restore : {
								show : true
							}
						}
					},
					calculable : false,
		            animation:false,
					xAxis : [ {
						show : false,
						type : 'value',
						splitLine : {
							show : false
						},
						axisLine : {
							lineStyle : {
								color : '#cccccc'
							}
						}
					} ],
					yAxis : [ {
						type : 'category',
						data : obj.y,
						splitLine : {
							show : false
						},
						axisLabel : {
							textStyle : {
								fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
								fontWeight : 'normal'
							// fontSize: 14
							}
						},
						axisLine : {
							lineStyle : {
								color : '#cccccc'
							}
						}
					} ],
					series : [ {
						name : '网站访问量',
						type : 'bar',
						// barGap:80,
						barMaxWidth : 18,
						data : obj.x
					} ]
				};
		
				myChart.setOption(option);
			});
		},
		buildType7 : function(obj, name) {
			var self = this;
			
			require([ 'echarts3/echarts.min'], function(
					ec) {
				var myChart = ec.init(document.getElementById("type7"));
				self.charts.push(myChart);
				var option = {
					title : {
						text : name
					},
					tooltip : {
						trigger : 'axis',
						axisPointer : {
							type : 'shadow'
						}
					},
					toolbox : {
						show : false,
						padding : [ 5, 20, 5, 5 ],
						feature : {
							// mark: {show: true},
							// dataView: {show: true, readOnly: false},
							restore : {
								show : true
							}
						// saveAsImage: {show: true}
						}
					},
					calculable : false,
		            animation:false,
					grid : {
						y : 60,
						y2 : 40,
						x2 : 20,
						x : 40
					},
					xAxis : [ {
						type : 'category',
						data : [ "流入峰值利用率", "流出峰值利用率" ],
						axisLabel : {
							textStyle : {
								fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
								fontWeight : 'normal'
							// fontSize: 16
							}
						},
						splitLine : {
							show : false
						},
						axisLine : {
							lineStyle : {
								color : '#cccccc'
							}
						}
					} ],
					yAxis : [ {
						name : '单位(%)',
						type : 'value',
						axisLabel : {
							textStyle : {
								fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
								fontWeight : 'normal'
							// fontSize: 14
							}
						},
						axisLine : {
							lineStyle : {
								color : '#cccccc'
							}
						}
					} ],
					series : [ {
						barMaxWidth : 40,
						text : name,
						type : 'bar',
						barGap : 30,
						data : [ obj['INBAND'], obj['OUTBAND'] ]
					} ]
				};
				myChart.setOption(option);
			});
		},
		buildType8 : function(obj, name) {
			var self = this;
			var nameY = "话务量";
			if (obj['2G_HUAWU'] > 10000 || obj['2G_HUAWU_AVG'] > 10000
					|| obj['3G_HUAWU'] > 10000 || obj['3G_HUAWU_AVG'] > 10000) {
				nameY += "(万 ERL)";
			} else {
				nameY += "(ERL)";
			}
			
			require([ 'echarts3/echarts.min'],function(ec) {
						var myChart = ec.init(document.getElementById("type8"));
						self.charts.push(myChart);
						var option = {
							title : {
								text : name
							},
							tooltip : {
								trigger : 'axis',
								axisPointer : {
									type : 'shadow'
								}
							},
							legend : {
								x : 'center',
								y : 'bottom',
								data : [ '2G全天话务量(ERL)', '3G全天话务量(ERL)', '2G流量(GB)',
										'3G流量(GB)' ],
								textStyle : {
									fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
									fontWeight : 'normal'
								}
							},
							toolbox : {
								show : false,
								padding : [ 5, 20, 5, 5 ],
								feature : {
									// mark: {show: true},
									// dataView: {show: true, readOnly: false},
									restore : {
										show : true
									}
								// saveAsImage: {show: true}
								}
							},
							calculable : false,
		                    animation:false,
							grid : {
								y : 60,
								y2 : 80,
								x2 : 50,
								x : 50
							},
							xAxis : [ {
								type : 'category',
								data : [
										obj.timeshow.replace(/[^0-9]/mg, '.')
												.match(/.{10}/), "均值" ],
								axisLabel : {
									textStyle : {
										fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
										fontWeight : 'normal'
									// fontSize: 18
									}
								},
								splitLine : {
									show : false
								},
								axisLine : {
									lineStyle : {
										color : '#cccccc'
									}
								}
							} ],
							yAxis : [
									{
										name : nameY,
										type : 'value',
										axisLabel : {
											formatter : function(value) {
												if (nameY.indexOf("万") != -1) {
													return value / 10000;
												} else {
													return value;
												}
											},
											textStyle : {
												fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
												fontWeight : 'normal'
											// fontSize: 14
											}
										},
										axisLine : {
											lineStyle : {
												color : '#cccccc'
											}
										}
									},
									{
										name : '流量(GB)',
										type : 'value',
										axisLabel : {
											textStyle : {
												fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
												fontWeight : 'normal'
											// fontSize: 14
											}
										},
										axisLine : {
											lineStyle : {
												color : '#cccccc'
											}
										}
									} ],
							series : [ {
								name : '2G全天话务量(ERL)',
								type : 'bar',
								data : [ obj['2G_HUAWU'], obj['2G_HUAWU_AVG'] ]
							}, {
								name : '3G全天话务量(ERL)',
								type : 'bar',
								data : [ obj['3G_HUAWU'], obj['3G_HUAWU_AVG'] ]
							}, {
								name : '2G流量(GB)',
								type : 'bar',
								data : [ obj['2G_LIU'], obj['2G_LIU_AVG'] ],
								yAxisIndex : 1
							}, {
								name : '3G流量(GB)',
								type : 'bar',
								data : [ obj['3G_LIU'], obj['3G_LIU_AVG'] ],
								yAxisIndex : 1
							} ]
						};
						myChart.setOption(option);
					});
		},
		buildType9 : function(obj, name) {
			var self = this;
			var nameY = "话务量";
			if (obj['2G_HUAWU'] > 10000 || obj['2G_HUAWU_AVG'] > 10000
					|| obj['3G_HUAWU'] > 10000 || obj['3G_HUAWU_AVG'] > 10000) {
				nameY += "(万 ERL)";
			} else {
				nameY += "(ERL)";
			}
			
			require([ 'echarts3/echarts.min'],function(ec) {
						var myChart = ec.init(document.getElementById("type9"));
						self.charts.push(myChart);
						var option = {
							title : {
								text : name
							},
							tooltip : {
								trigger : 'axis',
								axisPointer : {
									type : 'shadow'
								}
							},
							legend : {
								x : 'center',
								y : 'bottom',
								data : [ '2G全天话务量(ERL)', '3G全天话务量(ERL)', '2G流量(GB)',
										'3G流量(GB)' ],
								textStyle : {
									fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
									fontWeight : 'normal'
								// fontSize: 10
								}
							},
							toolbox : {
								show : false,
								padding : [ 5, 20, 5, 5 ],
								feature : {
									// mark: {show: true},
									// dataView: {show: true, readOnly: false},
									restore : {
										show : true
									}
								// saveAsImage: {show: true}
								}
							},
							calculable : false,
		                    animation:false,
							grid : {
								y : 60,
								y2 : 80,
								x2 : 50,
								x : 50
							},
							xAxis : [ {
								type : 'category',
								data : [
										obj.timeshow.replace(/[^0-9]/mg, '.')
												.match(/.{10}/), "均值" ],
								axisLabel : {
									textStyle : {
										fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
										fontWeight : 'normal'
									// fontSize: 18
									}
								},
								splitLine : {
									show : false
								},
								axisLine : {
									lineStyle : {
										color : '#cccccc'
									}
								}
							} ],
							yAxis : [
									{
										name : nameY,
										type : 'value',
										axisLabel : {
											formatter : function(value) {
												if (nameY.indexOf("万") != -1) {
													return value / 10000;
												} else {
													return value;
												}
											},
											textStyle : {
												fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
												fontWeight : 'normal'
											}
										},
										axisLine : {
											lineStyle : {
												color : '#cccccc'
											}
										}
									},
									{
										name : '流量(GB)',
										type : 'value',
										axisLabel : {
											textStyle : {
												fontFamily : 'Microsoft Yahei, Helvetica, sans-serif',
												fontWeight : 'normal'
											// fontSize: 14
											}
										},
										axisLine : {
											lineStyle : {
												color : '#cccccc'
											}
										}
									} ],
							series : [ {
								name : '2G全天话务量(ERL)',
								type : 'bar',
								data : [ obj['2G_HUAWU'], obj['2G_HUAWU_AVG'] ]
							}, {
								name : '3G全天话务量(ERL)',
								type : 'bar',
								data : [ obj['3G_HUAWU'], obj['3G_HUAWU_AVG'] ]
							}, {
								name : '2G流量(GB)',
								type : 'bar',
								data : [ obj['2G_LIU'], obj['2G_LIU_AVG'] ],
								yAxisIndex : 1
							}, {
								name : '3G流量(GB)',
								type : 'bar',
								data : [ obj['3G_LIU'], obj['3G_LIU_AVG'] ],
								yAxisIndex : 1
							} ]
						};
						myChart.setOption(option);
					});
		},
		/**
		 * 分享按钮点击
		 */
		shareWin: function() {
			var win_top = -parseInt($('.share_win').height()) / 2 - 35 + "px";
			$('.share_win').css('margin-top', win_top);
			$('.share_win, .overlay').show();
		},
		closeWin : function() {
			$(".share_win").hide();
		},
		selectType : function(obj) {
			this.type = obj.attr("type");
			this.time = obj.attr("time");
			this.timevalue = obj.attr("time");
			this.getHolData();
		},
        render: function (obj) {
            this.$el.append(this.template({type:50}));
            return this;
        }
    });

    return View;
});