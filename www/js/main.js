require.config({
    baseUrl:"./js",
    urlArgs:"r="+(new Date()).getTime(),
    packages : [ 
    {
            name : 'echarts',
            location : 'libs/echarts-2.2.7/src',
            main : 'echarts'
        },
        {
            name : 'zrender',
            location : 'libs/zrender-2.1.1/src',
            main : 'zrender'
        }
    ],
    paths: {
    	echarts3:'libs/echarts-3.0.1',
        jquery: 'libs/jquery/jquery-1.9.1.min',
        jqm: 'libs/jquery.mobile-1.4.5/jquery.mobile-1.4.5.min',
        underscore:"libs/underscore-master/underscore-min",
        backbone:"libs/backbone-master/backbone-min",
        fastclick:'libs/fastclick',
        jquerycookie:'libs/jquery.cookie',
        portalPlugin:'libs/portalPlugin',
        iscroll:'libs/iscroll_5.1.3',
        des:'libs/des',
        text:'libs/require/plugins/text',
        templates:'../templates',
        modules:'../modules',
        model:'../model',
        baidumap:'libs/baidumap',
        bmap:'libs/baidumap/api2.0',
        bmaplib:'libs/baidumap/MarkerClusterer_min',
        textIconOverlay:'libs/baidumap/TextIconOverlay_min',
        geoUtils:'libs/baidumap/GeoUtils_min',
        searchInfoWindow:'libs/baidumap/SearchInfoWindow_min',
        'leaflet': 'libs/leaflet/dist/leaflet',
        'esri-leaflet': 'libs/esri-leaflet/dist/esri-leaflet',
//        'esri-leaflet-geocoder': 'libs/esri-leaflet-geocoder/dist/esri-leaflet-geocoder',
        'proj4leaflet': 'libs/proj4leaflet/src/proj4leaflet',
        'proj4': 'libs/proj4leaflet/lib/proj4-compressed'
    },
    shim: {
        jqm:{
            deps: ['jquery','css!libs/jquery.mobile-1.4.5/jquery.mobile.structure-1.4.5.min.css']
        },

        app:{
            deps:['jquerycookie','portalPlugin','des','css!../css/gis.css','css!../css/css.css','css!libs/leaflet/dist/leaflet.css','css!libs/esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css']
        },
        bmap:{
            exports:'BMap'
        },
        bmaplib:{
            exports:'BMapLib',
            deps: ['textIconOverlay','geoUtils','searchInfoWindow','css!baidumap/SearchInfoWindow_min.css']
        },
        fastclick:{
            exports:'FastClick'
        },
        underscore:{
            exports:'_'
        },
        backbone:{
            deps:['underscore','jquery'],
            exports:'Backbone'
        },
        iscroll:{
            exports:'IScroll'
        }
    },
    map : {
        '*' : {
            'css' : 'libs/require/plugins/css.min'
        }
    }
});
require(['app','jqm-config'], function(App){
    App.initialize();
});

var ARCGIS_PATH="./js/";

var actionInfo = {
    url: 'http://119.188.254.29:10998/wyw/',
    //登录
    login: 'webapp/welcomeAction!login.action',
    //登出
    logout: 'webapp/welcomeAction!logout.action',
    //分类查询
    getGroup: 'webapp/webAppGroupKpiAction!getGroup.action',
    //查询订阅
    getSub: 'webapp/subAction!getSub.action',
    //新增订阅
    saveSub: 'webapp/subAction!saveSub.action',
    //删除订阅
    deleteSub: 'webapp/subAction!deleteSub.action',
    //查询订阅指标列表
    getSubscribeKpis: 'webapp/serviceCenterAction!getSubscribeKpis.action',
    //查询kpi数据
    queryKpiData: 'webapp/serviceCenterAction!queryKpiData.action',
    //根据kpi ids查询数据
    queryKpisData: 'webapp/serviceCenterAction!queryKpisData.action',
    //查询kpi时间列表
    getTimeList: 'webapp/serviceCenterAction!getTimeList.action',
    //节日保障数据查询
    getHolidayData: 'webapp/serviceCenterAction!getHolidayData.action',
    //获取微信ticket
    getWeiXinTicket: 'webapp/serviceCenterAction!getWeiXinTicket.action',
    //gis全省断站
    breakPointHundred: 'report/cmsReportAction!breakPointHundred.action',
    //gis附近断站
    breakPoint: 'report/cmsReportAction!breakPoint.action',
    //概况统计断站显示
    brokenCount:'webapp/serviceCenterAction!queryKpiData.action',
    //基站分布
    ranking : 'gis/gisBreakAction!cityRanking.action',
    //
    countryRanking : 'gis/gisBreakAction!countyRanking.action',
    //获得城市断站数据
    cityBreak : 'gis/gisBreakAction!getCity.action',
    //获得断站数目
    moCount : 'gis/gisBreakAction!getMoCount.action',
    //根据地图所示范围查询断站数据
    moCountByBounds : '/gis/gisBreakAction!getMoCountByBounds.action',

    MoByBounds:'/gis/gisBreakAction!getMoByBounds.action',

    MoByBoundsNew:'/gis/gisBreakAction!getMoByBoundsNew.action'
};

function handleAjaxSessionTimeOut(xhr) {
    if (xhr.getResponseHeader('sessionstatus') == 'timeout') {
        navigator.notification.confirm('长时间未操作请重新登录！', function () {
            logout();
        }, '提示', 'OK');
        return true;
    }
    else
    {
        return false;
    }
}
/**
 *显示正在加载蒙版
 */
function showLoadingMask(text)
{
    if(device.available)
    {
        navigator.ActivityIndicator.hide();
        navigator.ActivityIndicator.show(text);
    }
}

/**
 *隐藏正在加载蒙版
 */
function hideLoadingMask()
{
    if(device.available)
    {
        navigator.ActivityIndicator.hide();
    }
}

function checkNetWork(){
    if(device.available){
        console.info("checkNetWork:"+navigator.connection.type);
        switch(navigator.connection.type){
//            case Connection.UNKNOWN:
//                navigator.notification.confirm('当前网络未知！', function () {
//                    return false;
//                }, '提示', 'OK');
//                break;
            case Connection.NONE:
                navigator.notification.confirm('当前网络未连接！', function () {
                    return false;
                }, '提示', 'OK');
                break;
//            case Connection.CELL_2G:
//                navigator.notification.confirm('当前2G网络！', function (btn) {
//                    if (btn == 1) {
//                        return true;
//                    }
//                    return false;
//                }, '提示', ['继续', '取消']);
//                break;
//            case Connection.CELL_3G:
//                navigator.notification.confirm('当前3G网络！', function (btn) {
//                    if (btn == 1) {
//                        return true;
//                    }
//                    return false;
//                }, '提示', ['继续', '取消']);
//                break;
//            case Connection.CELL_4G:
//                navigator.notification.confirm('当前4G网络！', function (btn) {
//                    if (btn == 1) {
//                        return true;
//                    }
//                    return false;
//                }, '提示',['继续', '取消']);
//                break;
            default :
                return true;
                break;
        }
    }
    return true;
}

function onBackKeyDown() {
    showToast('再按一次退出沃运维');
    document.removeEventListener("backbutton", onBackKeyDown); // 注销返回键
    document.addEventListener("backbutton", exit);//绑定退出事件
    // 3秒后重新注册
    var intervalID = window.setInterval(function() {
        window.clearInterval(intervalID);
        document.removeEventListener("backbutton", exit); // 注销返回键
//        document.addEventListener("backbutton", onBackKeyDown); // 返回键
    }, 3000);
}


/**
 * 自定义toast，js实现android中toast效果
 * @param msg 显示文字
 * @param duration 显示的时间长度
 */
function showToast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "width:60%; min-width:150px; background:#000; opacity:0.5; height:30px; color:#fff; line-height:30px; text-align:center; border-radius:30px; position:fixed; bottom:5%; left:20%; z-index:999999; font-weight:bold;";
    document.body.appendChild(m);
    setTimeout(function() {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d
            + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function() {
            document.body.removeChild(m)
        }, d * 1000);
    }, duration);
}
function exit() {
    navigator.app.exitApp();
    // 使用节流方法弹出confirm框，1000ms内只弹出一次，防止多次弹出
//        _throttle(
//            navigator.notification.confirm(
//                '确定退出？',  // message
//                function (btn) {
//                    if (btn == 1) { // 1对应按钮数组中的第一个位置，这里就是“确定”；2对应“取消”
//                        navigator.app.exitApp(); // 调用cordova已经封装好的方法，退出应用
//                    }
//                }, '提示', ['确定', '取消'])
//            , 1000);
};
function _throttle(func, wait) {
    var context, args, timeout, result;
    var previous = 0;
    var later = function () {
        previous = new Date;
        timeout = null;
        result = func.apply(context, args);
    };
    return function () {
        var now = new Date;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
        } else if (!timeout) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};

//var _checkAppUpdateCallback;
function checkAppUpdate(callback){
//    _checkAppUpdateCallback=callback;
    if(device.available){
        console.info("[checkAppUpdate]")
        if(!checkNetWork()){
//            if(_checkAppUpdateCallback){
//                _checkAppUpdateCallback.call();
//            }
            return;
        }
        getUpdateInfo(
            function (versionInfo) {
                if (device.platform)
                {
                    sessionStorage.setItem("version",versionInfo.versionName);
                    if((versionInfo.update == true || versionInfo.update == 'true')
                        && (versionInfo.show == true || versionInfo.show == 'true'))
                    {
                        initUpdateDialog(
                            $('.window'), // 初始化哪一个更新提示对话框，jQuery对象
                            versionInfo, // json对象，包含更新信息，是否需要更新
                            null, // 取消更新时的回调方法（登录）
                            true // 是否在初始化对话框后显示对话框
                        );
                    }
                    else
                    {
                        // 获取模块更新信息
                        getUpdateModuleInfo(function(){
                            console.info("[getUpdateModuleInfo]")
//                            console.info(_checkAppUpdateCallback)
//                            if(_checkAppUpdateCallback){
//                                _checkAppUpdateCallback.call();
//                            }
                        });
                    }
                }
                sessionStorage.setItem("hasOpenPwdDlg","false");
                //$('#v2_welcome').trigger('tap');
            }
        );
//    }else{
//        if(_checkAppUpdateCallback){
//            _checkAppUpdateCallback.call();
//        }
    }
}


function testSQLite() {
	var db = openDatabase("DB-Deletable", "1.0", "Demo", 5000000);

	db.transaction(function(tx) {
		tx.executeSql('DROP TABLE IF EXISTS test_table');
		tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');
		tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test", 100]);
	});
}

function testIndexDB()
{
	var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
	
	var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
    var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

	adsageIDB = {};
	adsageIDB.db = null;

	adsageIDB.onerror = function(e) {
		console.log(e);
	};

	adsageIDB.open = function() {
		var request = indexedDB.open("adsageIDB",3);
		request.onupgradeneeded = function(event) {
			console.log("onupgradeneeded");
			adsageIDB.db = request.result;
			var db = adsageIDB.db;
			
			if (db.objectStoreNames.contains("todo")) {
				db.deleteObjectStore("todo");
			}

			var store = db.createObjectStore("todo", {
				keyPath : "adsid"
			});
		};
		
		request.onsuccess = function() {
			console.log("onsuccess");
			adsageIDB.db = request.result;
		  	adsageIDB.addTodo("123","1");
			adsageIDB.addTodo("456","2");
			adsageIDB.deleteTodo("2");
		};
		request.onerror = adsageIDB.onerror;
	};

	adsageIDB.addTodo = function(todoText,id) {
		var db = adsageIDB.db;
		var trans = db.transaction(["todo"], "readwrite");
		var store = trans.objectStore("todo");

		var data = {
			"text" : todoText,
			"adsid" : id
		};

		var request = store.put(data);

		request.onsuccess = function(e) {
			console.log("Success Adding: ");
		};

		request.onerror = function(e) {
			console.log("Error Adding: ", e);
		};
	};

	adsageIDB.deleteTodo = function(id) {
		var db = adsageIDB.db;
		var trans = db.transaction(["todo"], "readwrite");
		var store = trans.objectStore("todo");

		var request = store.delete(id);

		request.onsuccess = function(e) {
			console.log("Success Deleteing: ");
		};

		request.onerror = function(e) {
			console.log("Error Deleteing: ", e);
		};
	};
	adsageIDB.open(); 
}


/**
 * 初始化版本更新提示对话框
 * @param dialog 对话框jQuery对象（因为欢迎页面和首页都有更新提示对话框）
 * @param versoinInfo 版本信息对象
 * @param closeCallback 关闭、取消按钮回调方法
 */
function initUpdateDialog(dialog, versionInfo, closeCallback, show){

    var btnArray=[];
    if((versionInfo.must == true || versionInfo.must == 'true') && (versionInfo.show == true || versionInfo.show == 'true')){
        btnArray.push('确定');
    }else{
        btnArray.push('确定');
        btnArray.push('取消');
    }
    navigator.notification.confirm(
        versionInfo.description,  // message
                function (btn) {
                    if (btn == 1) { // 1对应按钮数组中的第一个位置，这里就是“确定”；2对应“取消”
                        updateApp();
                    }
                }, '有可用更新' + versionInfo.versionName, btnArray);
}

function EncoUrlParam(param)
{
	var params = param.split("&"); 
	for(var i in params)
	{	
		var map = params[i].split("=");
		if(map.length == 2 && map[1])
		{
			param = param.replace(params[i],map[0]+"="+strEnc(map[1],"asiainfo","NSG","wo"));
		}
	}
	return param;
}

function ajaxinit(){
    console.info("ajax setup init");
    $.ajaxSetup({ //设置ajax全局属性
        timeout: 30 * 1000, // 设置全局超时时间为30s
        type: "POST",
        isShowMask:true,
        security:true,
        beforeSend: function (xhr, s) {
            if(this.security){
                var token = sessionStorage.getItem('token') == null ? "" : sessionStorage.getItem('token');
                var param;
                if(this.url && this.url.indexOf("?") != -1)
                {
                    param = this.url.substring(this.url.indexOf("?") + 1);
                    param += "&token=" + token;
                    this.url = this.url.substring(0, this.url.indexOf("?")) + EncoUrlParam(param);
                }
                else if(this.url && this.url.indexOf("?") == -1)
                {
                    param = "token=" + token;
                    this.url += "?" + EncoUrlParam(param);
                }

                if(this.data)
                {
                    this.data = EncoUrlParam(this.data);
                }
            }
            if(this.isShowMask){
                showLoadingMask();
            }
        },
        complete: function (xhr, status) { // 在ajax请求完成时关闭蒙版和提示框
            hideLoadingMask();
        },
        error: function (xhr) { // ajax请求失败时关闭蒙版和提示框
            hideLoadingMask();
        }
    });
}


/**
* 弹出框插件
*/
function WinBox(o)
{
	var self = this;
	self.option = $.extend({
		container: "body",
		html: '',
		title:'',
		isoverlay:false,
		callback:function(){},
		closeWin:function(){}
	}, o);
	self.init();
}

/**
 * 初始化弹出框
 */
WinBox.prototype.init = function(){
	var self = this;
	var win = '';
	if(self.option.isoverlay)
	{
		win += '<div class="overlay"></div>';
	}
	win += '<div class="window" style="display: block;"><div class="wtitle">'+ self.option.title +'<span class="close"></span></div><div class="win_content clearfix" id="popWin"></div></div>';
	var body = $(self.option.container);
	body.find(".window").remove();
	body.find("footer").before(win);
	body.find("#popWin").html(self.option.html);

	body.find(".close").off("tap").on("tap",function(e){
		body.find(".window").remove();
		e.preventDefault();
		self.option.closeWin();
	});
	
	var win_top = -parseInt($('.window').height()) / 2 - 35 + "px";
	body.find('.window').css('margin-top', "-153px");
	self.option.callback();
};

/**
 * 关闭弹出框
 */
WinBox.prototype.closeWinBox = function(){
	var self = this;
	var body = $(self.option.container);
	body.find(".window").remove();
};

/**
 * 隐藏弹出框
 */
WinBox.prototype.hideWinBox = function(){
	var self = this;
	var body = $(self.option.container);
	body.find(".window").hide();
};
