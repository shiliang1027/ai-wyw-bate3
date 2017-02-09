// 读取Imsi
function readImsi() {
    var imsi = '';
    if (device.platform != null && typeof(device.platform) != 'undefined') {
        var platform = device.platform.toLowerCase();
        if (platform == "android") { // 如果为安卓系统，则直接调用获取imsi的plugin
            cordova.exec(function (winParam) {
                    imsi = winParam;
                },
                function (error) {
                    imsi = '';
                },
                "ReadEnv",
                "getImsi", []);
        }
        else if (platform == 'ios') {
            // 读取当前主机IP（IOS环境）
            imsi = 'ios'
        }
    }

    return imsi;
}
var iosDownUrl;
// 检测是否有新版本
function needUpdate() {
    var resultStr = '';
    cordova.exec(function (winParam) {
            var resultInfo = $.parseJSON(winParam);
            var updateSpan = $("#v2_index_page .up_info");
            if (resultInfo.havenew == 'YES') {
                iosDownUrl = resultInfo.downurl;
                // window.open(resultInfo.downurl));
                updateSpan.show().children("span").text(_portal.versionInfo.versionName);
            }
            else {
                updateSpan.hide();
            }
        },
        function (error) {
        },
        "UpdateVersion",
        "haveNew", []);
    return resultStr;
}
//
function getUpdateInfo(callback) {
    if (device.platform) {
        cordova.exec(function (winParam) {
                // 首页会需要用到其中的update和versionName字段，用来在左侧边栏显示版本信息
                console.log('调用获取版本信息插件，获取信息：' + winParam);
                var versionInfo = $.parseJSON(winParam);
                if (typeof callback == 'function') {
                    callback.call(this,versionInfo);
                }
            },

                function (error) {
                    if (typeof callback == 'function') {
                        callback.call(this,{});
                    }
            },
            "UpdateApp",
            "updateInfo", []);
    } else {
        callback.call();
    }
}

function getUpdateModuleInfo(callback,erroback) {
    if (device.platform) {
        cordova.exec(function (updateModuleInfo) {
                // 首页会需要用到其中的update和versionName字段，用来在左侧边栏显示版本信息
                console.log('获取模块更新信息成功,info:' + updateModuleInfo);
                callback.call(updateModuleInfo);
            },
            function (error) {
                console.log('获取模块更新信息失败'+error.message);
                if(erroback)
                {
                    erroback.call();
                }
                else{
                   plugins.toast.showLongCenter("下载更新失败,请稍后重试");
                }
            },
            "UpdateApp",
            "moduleUpdateInfo", []);
    } else {
        callback.call();
    }
}

function updateApp() {
    var platform = device.platform;
    cordova.exec(function (winParam) {

        },
        function (error) {

        },
        "UpdateApp",
        "update", []);
    // 静态资源根目录
}


function downLoadRmtFile(url, fileName, success, fail) {

}

function openOtherApps() {
    var platform = device.platform;
    cordova.exec(function (winParam) {

        },
        function (error) {

        },
        "openApps",
        "update", []);
}


/**beg  Toast Plugin **/
function Toast() {
}

Toast.prototype.show = function (message, duration, position, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "Toast", "show", [message, duration, position]);
};

Toast.prototype.showShortTop = function (message, successCallback, errorCallback) {
    this.show(message, "short", "top", successCallback, errorCallback);
};

Toast.prototype.showShortCenter = function (message, successCallback, errorCallback) {
    this.show(message, "short", "center", successCallback, errorCallback);
};

Toast.prototype.showShortBottom = function (message, successCallback, errorCallback) {
    this.show(message, "short", "bottom", successCallback, errorCallback);
};

Toast.prototype.showLongTop = function (message, successCallback, errorCallback) {
    this.show(message, "long", "top", successCallback, errorCallback);
};

Toast.prototype.showLongCenter = function (message, successCallback, errorCallback) {
    this.show(message, "long", "center", successCallback, errorCallback);
};

Toast.prototype.showLongBottom = function (message, successCallback, errorCallback) {
    this.show(message, "long", "bottom", successCallback, errorCallback);
};

Toast.install = function () {
    if (!window.plugins) {
        window.plugins = {};
    }

    window.plugins.toast = new Toast();
    return window.plugins.toast;
};

cordova.addConstructor(Toast.install);
/**end  Toast Plugin **/
/**beg  SysTool Plugin **/
function SysTool() {
};
SysTool.prototype.copy = function (success, error, text) {
    cordova.exec(success, error, "SysTool", "copy", [text]);
}
SysTool.install = function () {
    if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.sysTool = new SysTool();
    return window.plugins.sysTool;
}
cordova.addConstructor(SysTool.install);
/**end  SysTool Plugin **/
var ActivityIndicator = {
    show: function (text) {
        text = text || "请稍等...";
        cordova.exec(null, null, "ActivityIndicator", "show", [text]);
    },
    hide: function () {
        cordova.exec(null, null, "ActivityIndicator", "hide", []);
    }
};