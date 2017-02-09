/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone', 'iscroll', 'text!modules/gzzd/gzzdReset/viewTemplate.html'], function ($, _, Backbone, IScroll, viewTemplate) {
    var View = Backbone.View.extend({
        template: _.template(viewTemplate),
        events: {
            "pageshow": "pageShow",
            "pagehide": "pageHide",
            "input #resetconfigParam": "input_resetconfigParam",
            "tap .content":"contentclick"
        },
        initialize: function (options) {
            this.userInfoTypeT = 1;
            //hgu重启查询
            this.restartQueryUrl = "ItmsService/inquiryConfig";
            //hgu重启
            this.resetUrl = 'ItmsService/reset';
            this.urlstr = 'http://60.217.44.33:18080/';
        },
        contentclick: function () {
            $("#resetconfigParam").blur();
        },
        pageHide: function () {
            console.info("page hide...")
        },
        pageShow: function () {
            var that = this;
            this.loaded();
            $("#resetqueryConfigure").focus();
            this.initLi();
            $("#resetqueryConfigure").on("tap", function () {
                $("#resetconfigParam").blur();
                var configParam = $.trim($("#resetconfigParam").val());
                that.queryConfigHandler(that.userInfoTypeT, configParam);
            });

            $("#resetBut").on("tap", function () {
                $("#resetconfigParam").blur();
                var configParam = $.trim($("#resetconfigParam").val());
                var userInfoType = that.userInfoTypeT;
                that.userInfo = configParam;
                that.restartHandler(userInfoType, that.userInfo);
            });
        },
        input_resetconfigParam: function () {
//    body_height();
            if ($("#resetconfigParam").val().length == 0) {
                $("#resetconfigParam").addClass("px error-bor");
            } else {
                $("#resetconfigParam").removeClass("px error-bor");
                $("#resetconfigParam").addClass("px");
            }
        },
        loaded: function () {
            new IScroll('.testing_content', { bounceEasing: 'circular', bounceTime: 1200 });
        },
        initLi: function () {
            var that = this;
            $("#searchresetTypeRes").children("li").each(function () {
                $(this).on("tap", function () {
                    $(this).addClass("on");
                    $(this).siblings().removeClass("on");
                    $(this).attr("id");
                    that.swicthUserInfoType($(this).attr("id"));
                });
            });
        },
        swicthUserInfoType: function (type) {
            switch (type) {
                case 'resettab1':
                    this.userInfoTypeT = 1;
                    break;
                case 'resettab2':
                    this.userInfoTypeT = 6;
                    break;
                case 'resettab3':
                    this.userInfoTypeT = 2;
                    break;
                case 'resettab4':
                    this.userInfoTypeT = 4;
                    break;
                default:
                    this.userInfoTypeT = 1;
            }
        },
        queryConfigHandler: function (userInfoTypeT, configParam) {
            $.support.cors = true;
            var that = this;
            if (!this.validQueryText(configParam)) {
                return;
            }
            $.ajax({
                url: this.urlstr + this.restartQueryUrl + "?userInfo=" + configParam + "&userInfoType=" + userInfoTypeT,
                type: "post",
                dataType: "json",
                security:false,
                data: {},
                success: function (data, status, xhr) {
                    switch (data.code){
                        case 0:
                            $("#reseteqtPossession").html(data.value[0]['cityName']);
                            $("#reseteqtSNNum").html(data.value[0]['deviceSerialNumber']);
                            break;
                        default :
                            that.windowPop(data.detail);
                            break;
                    }
//                    if (data.code == 0) {
//                        $("#reseteqtPossession").html(data.value[0]['cityName']);
//                        $("#reseteqtSNNum").html(data.value[0]['deviceSerialNumber']);
//                    } else {
//                        $("#reseteqtPossession").html(data.value[0]['cityName']);
//                        $("#reseteqtSNNum").html(data.value[0]['deviceSerialNumber']);
//                        that.windowPop("查询失败！");
////                navigator.notification.alert('查询失败！', null, '提示', '确定' );
//                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $("#reseteqtPossession").html(data.value[0]['cityName']);
                    $("#reseteqtSNNum").html(data.value[0]['deviceSerialNumber']);
                    that.windowPop("查询失败！");
//            navigator.notification.alert('查询失败！', null, '提示', '确定' );
                }
            })
        },
        restartHandler: function (userInfoType, userInfo) {
            var that = this;
            $.support.cors = true;
            $.ajax({
                url: this.urlstr + this.resetUrl + "?userInfoType=" + userInfoType + "&userInfo=" + userInfo,
                type: "post",
                dataType: "json",
                security:false,
                data: {},
                success: function (data, status, xhr) {
                    if (data.code == 0) {
                        that.windowPop("HGU恢复出厂成功！");
//                navigator.notification.alert('HGU重启成功！', null, '提示', '确定' );
                    } else if (data.code == 1) {
                        that.windowPop("数据格式错误！");
//                navigator.notification.alert('数据格式错误！', null, '提示', '确定' );
                    } else if (data.code == 2) {
                        that.windowPop("客户端类型非法！");
//                navigator.notification.alert('客户端类型非法！', null, '提示', '确定' );
                    } else if (data.code == 3) {
                        that.windowPop("接口类型非法！");
//                navigator.notification.alert('接口类型非法！', null, '提示', '确定' );
                    } else if (data.code == 1000) {
                        that.windowPop("未知错误！");
//                navigator.notification.alert('未知错误！', null, '提示', '确定' );
                    } else if (data.code == 1001) {
                        that.windowPop("用户信息类型非法！");
                        navigator.notification.alert('用户信息类型非法！', null, '提示', '确定');
                    } else if (data.code == 1002) {
                        that.windowPop("无此用户信息！");
                        navigator.notification.alert('无此用户信息！', null, '提示', '确定');
                    } else if (data.code == 1004) {
                        that.windowPop("此用户未绑定！");
                        navigator.notification.alert('此用户未绑定！', null, '提示', '确定');
                    } else if (data.code == 1005) {
                        that.windowPop("无法连接设备！");
                        navigator.notification.alert('无法连接设备！', null, '提示', '确定');
                    } else if (data.code == 1006) {
                        that.windowPop("设备恢复出厂设置失败！");
                        navigator.notification.alert('设备恢复出厂设置失败！', null, '提示', '确定');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    that.windowPop("设备恢复出厂设置失败！");
                    navigator.notification.alert('设备恢复出厂设置失败！', null, '提示', '确定');
                }
            })
        },
        windowPop: function (Str) {
            var that = this;
            $("#popWin").html("<ul>" + Str + "</ul>");
            $(".window .wtitle").html("提示" + "<span class='close'></span>");
            var win_top = -parseInt($('.window').height()) / 2 - 35 + "px";
            $('.window').css('margin-top', "-153px");
            $('.window, .overlay').show();
            $("#gzzdResetPage").on("tap", ".close", function (e) {
                that.closeWin(this);
                e.preventDefault();
            });
        },
        closeWin: function (that) {
            $(that).parents(".window").hide();
            $(that).parents(".share_win").hide();
            $(".overlay").hide();
        },
        validQueryText: function (configParam) {
            if (configParam.length <= 0) {
                this.windowPop("输入不能为空！");
                $("#resetconfigParam").addClass("px error-bor");
                return false;
            }
            else {
                $("#resetconfigParam").removeClass("px error-bor");
                $("#resetconfigParam").addClass("px");
                return true;
            }
        },
        render: function () {
            this.$el.append(this.template());
            return this;
        }
    });

    return View;
});