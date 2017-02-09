/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone', 'iscroll', 'text!modules/gzzd/gzzdRestart/viewTemplate.html'], function ($, _, Backbone, IScroll, viewTemplate) {
    var View = Backbone.View.extend({
        template: _.template(viewTemplate),
        events: {
            "pageshow": "pageShow",
            "pagehide": "pageHide",
            "input #configParam": "input_configParam",
            "tap .content":"contentclick"
        },
        initialize: function (options) {
            this.userInfoTypeT = 1;
            //hgu重启查询
            this.restartQueryUrl = "ItmsService/inquiryConfig";
            //hgu重启
            this.restartUrl = 'ItmsService/reboot';
            this.urlstr = 'http://60.217.44.33:18080/';
            this.sessionId = sessionStorage.getItem('sessionId');
        },
        contentclick: function () {
            $("#configParam").blur();
        },
        pageHide: function () {
            console.info("page hide...")
        },
        pageShow: function () {
            var that = this;
            this.loaded();
            this.initLi();
            $("#queryConfigure").focus();
            $("#queryConfigure").on("tap", function () {
                $("#configParam").blur();
                var configParam = $.trim($("#configParam").val());
                that.queryConfigHandler(that.userInfoTypeT, configParam);
            });

            $("#restartBut").on("tap", function () {
                $("#configParam").blur();
                var configParam = $.trim($("#configParam").val());
                var userInfoType = that.userInfoTypeT;
                that.userInfo = configParam;
                that.restartHandler(userInfoType, that.userInfo);
            });
        },
        input_configParam: function () {
            //    body_height();
            if ($("#configParam").val().length == 0) {
                $("#configParam").addClass("px error-bor");
            } else {
                $("#configParam").removeClass("px error-bor");
                $("#configParam").addClass("px");
            }
        },
        loaded: function () {
            new IScroll('.testing_content', { bounceEasing: 'circular', bounceTime: 1200 });
        },
        initLi: function () {
            var that = this;
            $("#searchTypeRes").children("li").each(function () {
                $(this).on("tap", function () {
                    $(this).addClass("on");
                    $(this).siblings().removeClass("on");
                    $(this).attr("id");
                    swicthUserInfoType($(this).attr("id"));
                });
            });

            var swicthUserInfoType = function (type) {
                switch (type) {
                    case 'tab1':
                        that.userInfoTypeT = 1;
                        break;
                    case 'tab2':
                        that.userInfoTypeT = 6;
                        break;
                    case 'tab3':
                        that.userInfoTypeT = 2;
                        break;
                    case 'tab4':
                        that.userInfoTypeT = 4;
                        break;
                    default:
                        that.userInfoTypeT = 1;
                }
            };
        },
        queryConfigHandler: function (userInfoTypeT, configParam) {
            var that = this;
            $.support.cors = true;
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
                            $("#eqtPossession").html(data.value[0]['cityName']);
                            $("#eqtSNNum").html(data.value[0]['deviceSerialNumber']);
                            $("#eqtMethod").html("TR069");
                            break;
                        default :
                            that.windowPop(data.detail);
                            break;
                    }
//                    if (data.code == 0) {
//                        $("#eqtPossession").html(data.value[0]['cityName']);
//                        $("#eqtSNNum").html(data.value[0]['deviceSerialNumber']);
//                        $("#eqtMethod").html("TR069");
//                    } else {
////                windowPop(data.value[0]['deviceSerialNumber']);
//                        $("#eqtPossession").html(data.value[0]['cityName']);
//                        $("#eqtSNNum").html(data.value[0]['deviceSerialNumber']);
//                        $("#eqtMethod").html("TR069");
//
//                        that.windowPop("查询失败！");
////                navigator.notification.alert('查询失败！', null, '提示', '确定' );
//                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $("#eqtPossession").html(data.value[0]['cityName']);
                    $("#eqtSNNum").html(data.value[0]['deviceSerialNumber']);
                    $("#eqtMethod").html("TR069");

                    that.windowPop("查询失败！");
//            navigator.notification.alert('查询失败！', null, '提示', '确定' );
                }
            })
        },
        restartHandler: function (userInfoType, userInfo) {
            var that = this;
            $.support.cors = true;
            $.ajax({
                url: this.urlstr + this.restartUrl + "?userInfoType=" + userInfoType + "&userInfo=" + userInfo,
                type: "post",
                dataType: "json",
                security:false,
                data: {},
                success: function (data, status, xhr) {
//            alert(data.code);
                    if (data.code == 0) {
                        that.windowPop("HGU重启成功！");
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
//                navigator.notification.alert('用户信息类型非法！', null, '提示', '确定' );
                    } else if (data.code == 1002) {
                        that.windowPop("无此用户信息！");
//                navigator.notification.alert('无此用户信息！', null, '提示', '确定' );
                    } else if (data.code == 1004) {
                        that.windowPop("此用户未绑定！");
//                navigator.notification.alert('此用户未绑定！', null, '提示', '确定' );
                    } else if (data.code == 1005) {
                        that.windowPop("无法连接设备！");
//                navigator.notification.alert('无法连接设备！', null, '提示', '确定' );
                    } else if (data.code == 1006) {
                        that.windowPop("设备重启失败！");
//                navigator.notification.alert('设备重启失败！', null, '提示', '确定' );
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    that.windowPop("HGU重启失败！");
//            navigator.notification.alert('HGU重启失败！', null, '提示', '确定' );
                }
            })
        },
        validQueryText: function (configParam) {
            if (configParam.length <= 0) {
                this.windowPop("输入不能为空！");
                $("#configParam").addClass("px error-bor");
                return false;
            }
            else {
                $("#configParam").removeClass("px error-bor");
                $("#configParam").addClass("px");
                return true;
            }
        },
        windowPop: function (Str) {
            var that = this;
            $("#popWin").html("<ul>" + Str + "</ul>");
            $(".window .wtitle").html("提示" + "<span class='close'></span>");
            var win_top = -parseInt($('.window').height()) / 2 - 35 + "px";
            $('.window').css('margin-top', "-153px");
            $('.window, .overlay').show();
            $("#gzzdRestartPage").on("tap", ".close", function (e) {
                that.closeWin(this);
                e.preventDefault();
            });
        },
        closeWin: function (that) {
            $(that).parents(".window").hide();
            $(that).parents(".share_win").hide();
            $(".overlay").hide();
        },
        render: function () {
            this.$el.append(this.template());
            return this;
        }
    });

    return View;
});