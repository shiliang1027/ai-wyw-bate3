/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone', 'iscroll', 'text!modules/gzzd/gzzdDiagnosis/viewTemplate.html'], function ($, _, Backbone, IScroll, viewTemplate) {
    var View = Backbone.View.extend({
        template: _.template(viewTemplate),
        events: {
            "pageshow": "pageShow",
            "pagehide": "pageHide",
            "input #faultdiagnosisParam": "input_faultdiagnosisParam",
            "tap .content":"contentclick"
        },
        initialize: function (options) {
            this.userInfoTypeT = 1;

            this.trStr = "";
            //hgu故障诊断
            this.diagnoseQueryUrl = 'ItmsService/diagnose';

            this.urlstr = 'http://60.217.44.33:18080/';

        },
        contentclick: function () {
            $("#faultdiagnosisParam").blur();
        },
        pageHide: function () {
            console.info("page hide...")
        },
        pageShow: function () {
            var that = this;
            this.loaded();
            $("#faultdiagnosisTesting").focus();
            $("#faultdiagnosisTesting").on("tap", function () {
                $("#faultdiagnosisParam").blur();
                var faultdiagnosisParam = $.trim($("#faultdiagnosisParam").val());
                that.queryConfigHandler(that.userInfoTypeT, faultdiagnosisParam);
            });
            this.initLi();
        },
        queryConfigHandler: function (userInfoTypeT, faultdiagnosisParam) {
            var that = this;
            $.support.cors = true;
            if (!this.validQueryText(faultdiagnosisParam)) {
                return;
            }
            $.ajax({
                url: this.urlstr + this.diagnoseQueryUrl + "?userInfo=" + faultdiagnosisParam + "&userInfoType=" + userInfoTypeT,
                type: "post",
                dataType: "json",
                security:false,
                data: {},
                success: function (data, status, xhr) {
                    console.info(data);
                    switch(data.code){
                        case 0:
                            $("#broadbandAccount").html(data.value.netAccount);
                            $("#logicId").html(data.value.loid);
                            $("#terminalManufacturers").html(data.value.vendor_name);
                            $("#softwareVersion").html(data.value.sofwareversion);
                            $("#hardwareVersion").html(data.value.hardwareversion);
                            $("#pvcRvlan").html(data.value.net_vlanid);
                            $("#bindPort").html(data.value.bind_port);
                            $("#connectStatus").html(data.value.voip_vlanid);
                            $("#registratStatus").html(data.value.voip_port);
                            break;
                        default :
                            that.windowPop(data.detail);
                            break;
                    }
//                    if (data.code == 0) {
//                        that.trStr = "";
//                        $("#broadbandAccount").html(data.value.netAccount);
//                        $("#logicId").html(data.value.loid);
//                        $("#terminalManufacturers").html(data.value.vendor_name);
//                        $("#softwareVersion").html(data.value.sofwareversion);
//                        $("#hardwareVersion").html(data.value.hardwareversion);
//                        $("#pvcRvlan").html(data.value.net_vlanid);
//                        $("#bindPort").html(data.value.bind_port);
//                        $("#connectStatus").html(data.value.voip_vlanid);
//                        $("#registratStatus").html(data.value.voip_port);
//
//                    } else if (data.code == 1) {
//                        that.trStr = "";
//                        $("#broadbandAccount").html("");
//                        $("#logicId").html("");
//                        $("#terminalManufacturers").html("");
//                        $("#softwareVersion").html("");
//                        $("#hardwareVersion").html("");
//                        $("#pvcRvlan").html("");
//                        $("#bindPort").html("");
//                        $("#connectStatus").html("");
//                        $("#registratStatus").html("");
////                navigator.notification.alert('查询失败！', null, '提示', '确定' );
//                        that.windowPop("查询失败！");
//                    } else if (data.code == 1) {
//                        that.trStr = "";
//                        $("#broadbandAccount").html("");
//                        $("#logicId").html("");
//                        $("#terminalManufacturers").html("");
//                        $("#softwareVersion").html("");
//                        $("#hardwareVersion").html("");
//                        $("#pvcRvlan").html("");
//                        $("#bindPort").html("");
//                        $("#connectStatus").html("");
//                        $("#registratStatus").html("");
////                navigator.notification.alert('参数格式错误，查询失败！', null, '提示', '确定' );
//                        windowPop("参数格式错误！");
//                    } else if (data.code == 2) {
//                        that.trStr = "";
//                        $("#broadbandAccount").html("");
//                        $("#logicId").html("");
//                        $("#terminalManufacturers").html("");
//                        $("#softwareVersion").html("");
//                        $("#hardwareVersion").html("");
//                        $("#pvcRvlan").html("");
//                        $("#bindPort").html("");
//                        $("#connectStatus").html("");
//                        $("#registratStatus").html("");
////                navigator.notification.alert('，查询失败！', null, '提示', '确定' );
//                        that.windowPop("查询失败！");
//                    } else if (data.code == 3) {
//                        for (var i = 0; i < data.value.length; i++) {
//                            var item = " <h4 class='info_title'>终端信息：</h4>" +
//                                "<table class='tab_main tab_info' style='margin-bottom:5px' width='100%' border='0' cellspacing='0' cellpadding='0'>" +
//                                "<tbody>" +
//                                "<tr>" +
//                                "<td>宽带账号</td>" +
//                                "<td>" + data.value[i].netAccount + "</td>" +
//                                "</tr>" +
//                                "<tr>" +
//                                "<td>逻辑ID</td>" +
//                                "<td>" + data.value[i].loid + "</td>" +
//                                "</tr>" +
//                                "<tr>" +
//                                " <td>终端厂商</td>" +
//                                "<td>" + data.value[i].vendor_name + "</td>" +
//                                "</tr>" +
//                                "<tr>" +
//                                "<td>软件版本</td>" +
//                                "<td>" + data.value[i].sofwareversion + "</td>" +
//                                "</tr>" +
//                                "<tr>" +
//                                "<td>硬件版本</td>" +
//                                "<td>" + data.value[i].hardwareversion + "</td>" +
//                                "</tr>" +
//                                "</tbody>" +
//                                "</table>" +
//                                "<h4 class='info_title'>业务信息-宽带上网：</h4>" +
//                                "<table class='tab_main' width='100%' border='0' cellspacing='0' cellpadding='0'>" +
//                                "<tbody>" +
//                                "<tr>" +
//                                "<td>宽带PVC/VLAN</td>" +
//                                "<td>" + data.value[i].net_vlanid + "</td>" +
//                                "</tr>" +
//                                "<tr>" +
//                                "<td>宽带绑定端口</td>" +
//                                "<td>" + data.value[i].bind_port + "</td>" +
//                                "</tr>" +
//                                "<tr>" +
//                                "<td>语音PVC/VLAN</td>" +
//                                "<td>" + data.value[i].voip_vlanid + "</td>" +
//                                "</tr>" +
//                                "<tr>" +
//                                "<td>语音端口</td>" +
//                                "<td>" + data.value[i].voip_port + "</td>" +
//                                "</tr>" +
//                                "</tbody>" +
//                                "</table>";
//                            that.trStr += item;
//
//                        }
//                        $(".infoDivClass").html(that.trStr);
//                        that.loaded();
//                        that.windowPop("查询到多个设备！");
//
//                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    that.windowPop("查询失败！");
//            navigator.notification.alert('查询失败！', null, '提示', '确定' );
                }
            })
        },
        validQueryText: function (faultdiagnosisParam) {
            if (faultdiagnosisParam.length <= 0) {
                $("#faultdiagnosisParam").addClass("px error-bor");
                this.windowPop("输入不能为空！");
                return false;
            }
            else {
                $("#faultdiagnosisParam").addClass("px");
                return true;
            }
        },
        windowPop: function (Str) {
            var that = this;
            $("#popWin").html("<ul>" + Str + "</ul>");
            $(".window .wtitle").html("提示" + "<span class='close'></span>");

            var win_top = -parseInt($('.window').height()) / 2 - 35 + "px";
            $('.window').css('margin-top', win_top);
            $('.window, .overlay').show();
            $("#gzzdDiagnosisPage").on("tap", ".close", function (e) {
                that.closeWin(this);
                e.preventDefault();
            });
        },
        closeWin: function (that) {
            $(that).parents(".window").hide();
            $(that).parents(".share_win").hide();
            $(".overlay").hide();
        },
        input_faultdiagnosisParam: function () {
//    body_height();
            if ($("#faultdiagnosisParam").val().length == 0) {
                $("#faultdiagnosisParam").addClass("px error-bor");
            } else {
                $("#faultdiagnosisParam").removeClass("px error-bor");
                $("#faultdiagnosisParam").addClass("px");
            }

        },
        initLi : function () {
            var that = this;
            $("#searchTypeDia").children("li").each(function() {
                $(this).on("tap", function() {
                    $(this).addClass("on");
                    $(this).siblings().removeClass("on");
                    $(this).attr("id");
                    swicthUserInfoType( $(this).attr("id"));
                });

                var swicthUserInfoType = function(type) {
                    switch(type)
                    {
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
            });
        },
        loaded: function () {
            new IScroll('#gzzdDiagnosisPage .content', { bounceEasing: 'circular', bounceTime: 1200 });
        },
        render: function () {
            this.$el.append(this.template());
            return this;
        }
    });

    return View;
});