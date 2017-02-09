/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone', 'iscroll', 'text!modules/gzzd/gzzdBroadband/viewTemplate.html'], function ($, _, Backbone, IScroll, viewTemplate) {
    var View = Backbone.View.extend({
        template: _.template(viewTemplate),
        events: {
            "pageshow": "pageShow",
            "pagehide": "pageHide",
            "click #gatherId": "tap_gatherId",
            "click #userType": "tap_userType",
            "input #checkUser": "input_checkUser",
            "tap #diagnosisSubmit":"click_diagnosisSubmit",
            "tap .content":"contentclick"
        },
        initialize: function (options) {
            this.arrgatherId = ["济南", "青岛", "烟台", "淄博", "临沂", "莱芜", "济宁", "泰安", "德州", "威海", "潍坊", "枣庄", "滨州", "东营", "菏泽" , "聊城", "日照"];
            this.arruserType = ["AD", "LAN", "PON"];
            this.type = "";
            this.textValue = "";
            this.userTypeValue = "";
            this.gatherIdValue = "";
            this.item = "";
            this.cityValue = "";
            this.customerAcceptanceNumber = "sdltApp" + String(new Date().getTime());
            this.infoAAAStr = "";
            this.infoStr = "";
            this.urlStr = "http://60.215.133.8:8088/ldimsWS/liposs/fault/centralengine/faultLocatorAction!faultLocator.action";
            this.urlaaaStr = "http://119.188.254.29:10998/wyw/webapp/serviceCenterAction!sendMsg.action";
            this.trStr = "";
            this.trStrStart = " <ul class='testing_loading clearfix'><li><img src='images/iconfont-wangluo_hover.png' alt=''/><p style='width: 50px'>核心网</p></li>" +
                "<li class='state'><img src='images/iconfont-gou.png' alt=''/></li>" +
                "<li><img src='images/iconfont-fuwuduan_hover.png' alt=''/><p>OLT</p></li>";

            this.trStrNull = " <ul class='testing_loading clearfix'><li><img src='images/iconfont-wangluo_hover.png' alt=''/><p style='width: 50px'>核心网</p></li>" +
                "<li class='state'><img src='images/iconfont-gou.png' alt=''/></li>" +
                "<li><img src='images/iconfont-fuwuduan_hover.png' alt=''/><p>OLT</p></li>" +
                "<li class='state'><img src='images/iconfont-chahao.png' alt=''/></li>" +
                "<li><img src='images/iconfont-iconyunfuwuqi.png' alt=''/><p>ONU</p></li>" +
                "<li class='state'></li>" +
                "<li><img src='images/iconfont-pc.png' alt=''/><p>PC</p></li><li class='line'></li></ul>";

            this.ADorLANtrStrInit = " <ul class='testing_loading clearfix'><li><img src='images/iconfont-wangluo.png' /><p style='width: 50px'>核心网</p></li>" +
                "<li class='state'></li>" +
                "<li><img src='images/iconfont-fuwuduan.png' /><p>BAS</p></li>" +
                "<li class='state'></li>" +
                "<li><img src='images/iconfont-iconyunfuwuqi.png' /><p>DSLAM</p></li>" +
                "<li class='state'></li>" +
                "<li><img src='images/iconfont-pc.png' /><p>PC</p></li><li class='line'></li></ul>";

            this.PONtrStrInit = " <ul class='testing_loading clearfix'><li><img src='images/iconfont-wangluo.png' alt=''/><p style='width: 50px'>核心网</p></li>" +
                "<li class='state'></li>" +
                "<li><img src='images/iconfont-fuwuduan.png' alt=''/><p>OLT</p></li>" +
                "<li class='state'></li>" +
                "<li><img src='images/iconfont-iconyunfuwuqi.png' alt=''/><p>ONU</p></li>" +
                "<li class='state'></li>" +
                "<li><img src='images/iconfont-pc.png' alt=''/><p>PC</p></li><li class='line'></li></ul>";
            this.trStrAD = "";
            this.trStrADStart = " <ul class='testing_loading clearfix'><li><img src='images/iconfont-wangluo_hover.png' alt=''/><p style='width: 50px'>核心网</p></li>" +
                "<li class='state'><img src='images/iconfont-gou.png' alt=''/></li>" +
                "<li><img src='images/iconfont-fuwuduan_hover.png' alt=''/><p>BAS</p></li>";
            this.trStrADNull = " <ul class='testing_loading clearfix'><li><img src='images/iconfont-wangluo_hover.png' alt=''/><p style='width: 50px'>核心网</p></li>" +
                "<li class='state'><img src='images/iconfont-gou.png' alt=''/></li>" +
                "<li><img src='images/iconfont-fuwuduan_hover.png' alt=''/>" +
                "<p>BAS</p></li>" +
                "<li class='state'><img src='images/iconfont-chahao.png' alt=''/></li>" +
                "<li><img src='images/iconfont-iconyunfuwuqi.png' alt=''/><p>DSLAM</p></li>" +
                "<li class='state'></li>" +
                "<li><img src='images/iconfont-pc.png' alt=''/><p>PC</p></li><li class='line'></li></ul>";

            this.ADorLANNullInfo = "<h4 class='info_title'>BAS信息-基本信息：</h4>" +
                "<table class='tab_main tab_info' style='margin-bottom:5px' width='100%' border='0' cellspacing='0' cellpadding='0'>" +
                "<tbody><tr><td>设备名称</td><td>" + "" +
                "</td></tr><tr><td>设备IP</td><td>" + "" +
                "</td></tr><tr><td>设备类型</td><td>" + "" +
                "</td></tr><tr><td>设备状态</td><td>" + "" +
                "</td></tr><tr><td>下联口管理状态</td><td>" + "" +
                "</td></tr><tr><td>下联口运行状态</td><td>" + "" +
                "</td></tr><tr><td>设备端口描述</td><td>" + "" +
                "</td></tr></tbody></table>" +
                "<h4 class='info_title'>DSLAM信息-基本信息：</h4>" +
                "<table class='tab_main tab_info' style='margin-bottom:5px' width='100%' border='0' cellspacing='0' cellpadding='0'>" +
                "<tbody><tr><td>设备IP</td><td>" + "" +
                "</td></tr><tr><td>设备型号</td><td>" + "" +
                "</td></tr><tr><td>端口编码</td><td>" + "" +
                "</td></tr><tr><td>设备状态</td><td>" + "" +
                "</td></tr><tr><td>端口管理状态</td><td>" + "" +
                "</td></tr><tr><td>端口运行状态</td><td>" + "" +
                "</td></tr><tr><td>最大下行速率</td><td>" + "" +
                "</td></tr><tr><td>最大上行速率</td><td>" + "" +
                "</td></tr></tbody></table>";

            this.PONNullInfo = "<h4 class='info_title'>OLT信息-基本信息：</h4>" +
                "<table class='tab_main tab_info' style='margin-bottom:5px' width='100%' border='0' cellspacing='0' cellpadding='0'>" +
                "<tbody><tr>" +
                "<td>设备名称</td><td>" + "" +
                "</td></tr><tr><td>设备IP</td><td>" + "" +
                "</td></tr><tr><td>设备型号</td><td>" + "" +
                "</td></tr><tr><td>端口编码</td><td>" + "" +
                "</td></tr><tr><td>设备状态</td><td>" + "" +
                "</td></tr><tr><td>端口管理状态</td><td>" + "" +
                "</td></tr><tr><td>端口运行状态</td><td>" + "" +
                "</td></tr><tr><td>发光功率</td><td>" + "" +
                "</td></tr><tr><td>收光功率</td><td>" + "" +
                "</td></tr><tr><td>软件版本</td><td>" + "" +
                "</td></tr><tr><td>SVLAN</td><td>" + "" +
                "</td></tr></tbody></table>" +
                "<h4 class='info_title'>ONU信息-基本信息：</h4>" +
                "<table class='tab_main tab_info' style='margin-bottom:5px' width='100%' border='0' cellspacing='0' cellpadding='0'>" +
                "<tbody><tr>" +
                "<td>设备名称</td><td>" + "" +
                "</td></tr><tr><td>设备IP</td><td>" + "" +
                "</td></tr><tr><td>设备型号</td><td>" + "" +
                "</td></tr><tr><td>端口编码</td><td>" + "" +
                "</td></tr><tr><td>设备状态</td><td>" + "" +
                "</td></tr><tr><td>上联口管理状态</td><td>" + "" +
                "</td></tr><tr><td>上联口运行状态</td><td>" + "" +
                "</td></tr><tr><td>发光功率</td><td>" + "" +
                "</td></tr><tr><td>收光功率</td><td>" + "" +
                "</td></tr><tr><td>软件版本</td><td>" + "" +
                "</td></tr><tr><td>硬件版本</td><td>" + "" +
                "</td></tr><tr><td>认证模式</td><td>" + "" +
                "</td></tr></tbody></table>";

            this.AAANullInfo = "<h4 class='info_title'>AAA信息：</h4>" +
                "<table class='tab_main tab_info' style='margin-bottom:5px' width='100%' border='0' cellspacing='0' cellpadding='0'>" +
                "<tbody><tr>" +
                "<td>宽带IP</td><td>" + "" +
                "</td></tr><tr><td>服务器IP</td><td>" + "" +
                "</td></tr><tr><td>MAC地址</td><td>" + "" +
                "</td></tr><tr><td>客户带宽</td><td>" + "" +
                "</td></tr><tr><td>客户口令</td><td>" + "" +
                "</td></tr><tr><td>绑定端口</td><td>" + "" +
                "</td></tr><tr><td>业务类型</td><td>" + "" +
                "</td></tr><tr><td>接入策略</td><td>" + "" +
                "</td></tr><tr><td>开户时间</td><td>" + "" +
                "</td></tr><tr><td>失效时间</td><td>" + "" +
                "</td></tr><tr><td>更新时间</td><td>" + "" +
                "</td></tr><tr><td>客户状态</td><td>" + "" +
                "</td></tr></tbody></table>";
        },
        contentclick:function(e){
            $("#checkUser").blur();
        },
        pageHide: function () {
            console.info("page hide...")
        },
        pageShow: function () {
            $(".aaadetailsInfoDiv").html(this.AAANullInfo);
            $(".detailsInfoDiv").html(this.PONNullInfo);
            this.loaded();
            $("#diagnosisSubmit").focus();
        },
        tap_gatherId: function () {
            this.popSelectTypeWin("属地", this.arrgatherId, 1);
        },
        tap_userType: function () {
            this.popSelectTypeWin("接入类型", this.arruserType, 2);
        },
        click_diagnosisSubmit: function () {
            $("#checkUser").blur();
            this.typeChange(1, $("#gatherId").val());
            this.typeChange(2, $("#userType").val());
            this.aaaUserInfoLoad();
            this.submitHandler();
        },
        input_checkUser: function () {
        //    body_height();
            if ($("#checkUser").val().length == 0) {
                $("#checkUser").addClass("px error-bor");
            } else {
                $("#checkUser").removeClass("px error-bor");
                $("#checkUser").addClass("px");
            }
        },
        //弹出窗口
        popSelectTypeWin: function (title, arr, type) {
            var htmlStr = "";
            var that = this;
            $.each(arr, function (i, val) {
                htmlStr += that.getObjItem(val, type);
            });
            $("#popWin").html("<ul>" + htmlStr + "</ul>");
            $(".window .wtitle").html(title + "<span class='close'></span>");

            var win_top = -parseInt($('.window').height()) / 2 - 35 + "px";
            $('.window').css('margin-top', "-153px");
            $('.window, .overlay').show();
            $("#gzzdBroadbandPage").on("click", ".close", function () {
                that.closeWin(this);
            });
            $("#gzzdBroadbandPage").on("click", ".window li", function () {
                that.type = $(this).attr("type");
                that.textValue = $(this).attr("value");
                that.closeWin(this);
                that.swicthUserInfoType(that.type, that.textValue);
            });
        },
        getObjItem: function (val, type) {
            var str = "";
            switch (type) {
                case 1:
                    if ($("#gatherId").val() == val) {
                        str = "<li type='1' class='on' value='" + val + "'>" + val + "</li>";
                    }
                    else {
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
                    }
                    else {
                        str = "<li type='1' class='' value='" + val + "'>" + val + "</li>";
                    }
                    break;
            }
            return str;
        },
        typeChange: function (type, textValue) {
            if (type == 1) {
                switch (textValue) {
                    case '济南':
                        this.gatherIdValue = "jinan";
                        this.cityValue = "2";
                        break;
                    case '青岛':
                        this.gatherIdValue = "qingdao";
                        this.cityValue = "3";
                        break;
                    case '烟台':
                        this.gatherIdValue = "yantai";
                        this.cityValue = "5";
                        break;
                    case '淄博':
                        this.gatherIdValue = "zibo";
                        this.cityValue = "7";
                        break;
                    case '临沂':
                        this.gatherIdValue = "linyi";
                        this.cityValue = "13";
                        break;
                    case '莱芜':
                        this.gatherIdValue = "laiwu";
                        this.cityValue = "8";
                        break;
                    case '济宁':
                        this.gatherIdValue = "jining";
                        this.cityValue = "6";
                        break;
                    case '泰安':
                        this.gatherIdValue = "taian";
                        this.cityValue = "18";
                        break;
                    case '德州':
                        this.gatherIdValue = "dezhou";
                        this.cityValue = "9";
                        break;
                    case '威海':
                        this.gatherIdValue = "weihai";
                        this.cityValue = "4";
                        break;
                    case '潍坊':
                        this.gatherIdValue = "weifang";
                        this.cityValue = "11";
                        break;
                    case '枣庄':
                        this.gatherIdValue = "zaozhuang";
                        this.cityValue = "17";
                        break;
                    case '滨州':
                        this.gatherIdValue = "binzhou";
                        this.cityValue = "14";
                        break;
                    case '东营':
                        this.gatherIdValue = "dongyin";
                        this.cityValue = "15";
                        break;
                    case '菏泽':
                        this.gatherIdValue = "heze";
                        this.cityValue = "16";
                        break;
                    case '聊城':
                        this.gatherIdValue = "liaocheng";
                        this.cityValue = "12";
                        break;
                    case '日照':
                        this.gatherIdValue = "rizhao";
                        this.cityValue = "10";
                        break;
                    default:
                        this.gatherIdValue = "jinan";
                        this.cityValue = "";
                        break;
                }
            } else if (type == 2) {
                switch (textValue) {
                    case 'AD':
                        this.userTypeValue = "10";
                        break;
                    case 'LAN':
                        this.userTypeValue = "11";
                        break;
                    case 'PON':
                        this.userTypeValue = "12";
                        break;
                    default:
                        this.userTypeValue = "10";
                }
            }
        },

        swicthUserInfoType: function (type, textValue) {
            if (type == 1) {
                switch (textValue) {
                    case '济南':
                        $("#gatherId").val("济南");
                        break;
                    case '青岛':
                        $("#gatherId").val("青岛");
                        break;
                    case '烟台':
                        $("#gatherId").val("烟台");
                        break;
                    case '淄博':
                        $("#gatherId").val("淄博");
                        break;
                    case '临沂':
                        $("#gatherId").val("临沂");
                        break;
                    case '莱芜':
                        $("#gatherId").val("莱芜");
                        break;
                    case '济宁':
                        $("#gatherId").val("济宁");
                        break;
                    case '泰安':
                        $("#gatherId").val("泰安");
                        break;
                    case '德州':
                        $("#gatherId").val("德州");
                        break;
                    case '威海':
                        $("#gatherId").val("威海");
                        break;
                    case '潍坊':
                        $("#gatherId").val("潍坊");
                        break;
                    case '枣庄':
                        $("#gatherId").val("枣庄");
                        break;
                    case '滨州':
                        $("#gatherId").val("滨州");
                        break;
                    case '东营':
                        $("#gatherId").val("东营");
                        break;
                    case '菏泽':
                        $("#gatherId").val("菏泽");
                        break;
                    case '聊城':
                        $("#gatherId").val("聊城");
                        break;
                    case '日照':
                        $("#gatherId").val("日照");
                        break;
                    default:
                        $("#gatherId").val("济南");
                }
            } else if (type == 2) {
                switch (textValue) {
                    case 'AD':
                        $("#userType").val("AD");
                        $(".imgDiv").html(this.ADorLANtrStrInit);
                        $(".detailsInfoDiv").html(this.ADorLANNullInfo);
                        break;
                    case 'LAN':
                        $("#userType").val("LAN");
                        $(".imgDiv").html(this.ADorLANtrStrInit);
                        $(".detailsInfoDiv").html(this.ADorLANNullInfo);
                        break;
                    case 'PON':
                        $("#userType").val("PON");
                        $(".imgDiv").html(this.PONtrStrInit);
                        $(".detailsInfoDiv").html(this.PONNullInfo);
                        break;
                    default:
                        $("#userType").val("ADorLANtrStrInit");
                }
            }
        },
        aaaUserInfoLoad: function () {
            this.infoAAAStr = "";
            var that = this;
            $(".aaadetailsInfoDiv").html(this.infoAAAStr);
            $.support.cors = true;
            if (!this.checkContextNull())
                return;
            $.ajax({
                url: this.urlaaaStr,
                type: "post",
                dataType: "json",
                data: {
                    topic:"/iposs/fault/mp/net/getUserInfo",
                    msg:"{\"customerAcceptanceNumber\":\"" + this.customerAcceptanceNumber + "\",\"customerTypes\":\"0\",\"accountIdentification\":\"" + this.cityValue + "\",\"serviceIdentification\":\"801\",\"userName\":\"" + $("#checkUser").val() + "\"}"
                },
                success: function (data, status, xhr) {
                    $(".aaadetailsInfoDiv").html("");
                    if (data.code == 1) {
                        if (data.value.result == 0 && data.value.data.length != 0) {
                            that.infoAAAStr = "<h4 class='info_title'>AAA信息：</h4>" +
                                "<table class='tab_main tab_info' style='margin-bottom:5px' width='100%' border='0' cellspacing='0' cellpadding='0'>" +
                                "<tbody><tr>" +
                                "<td>宽带IP</td><td>" + data.value["data"]["usersBroadbandIP"] +
                                "</td></tr><tr><td>服务器IP</td><td>" + data.value["data"]["accessServerIp"] +
                                "</td></tr><tr><td>MAC地址</td><td>" + data.value["data"]["userMac"] +
                                "</td></tr><tr><td>客户带宽</td><td>" + data.value["data"]["bandwidth"] +
                                "</td></tr><tr><td>客户口令</td><td>" + data.value["data"]["password"] +
                                "</td></tr><tr><td>绑定端口</td><td>" + data.value["data"]["bindPort"] +
                                "</td></tr><tr><td>业务类型</td><td>" + data.value["data"]["serviceType"] +
                                "</td></tr><tr><td>接入策略</td><td>" + data.value["data"]["accessStrategy"] +
                                "</td></tr><tr><td>开户时间</td><td>" + data.value["data"]["accOpenTime"] +
                                "</td></tr><tr><td>失效时间</td><td>" + data.value["data"]["failureTime"] +
                                "</td></tr><tr><td>更新时间</td><td>" + data.value["data"]["stateChangeTime"] +
                                "</td></tr><tr><td>客户状态</td><td>" + data.value["data"]["userStatus"] +
                                "</td></tr></tbody></table>";
                        } else {
                            that.infoAAAStr = that.AAANullInfo;
                            that.windowPop("AAA信息获取失败！");
                        }
                        $(".aaadetailsInfoDiv").html(that.infoAAAStr);
                    } else {
                        that.infoAAAStr = that.AAANullInfo;
                        $(".aaadetailsInfoDiv").html(that.infoAAAStr);
                        that.windowPop("AAA信息获取失败！");
                    }
                    that.loaded();

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    that.infoAAAStr = that.AAANullInfo;
                    $(".aaadetailsInfoDiv").html(that.infoAAAStr);
                    that.loaded();
                    that.windowPop("AAA信息获取失败！");
                }
            })
        },
        checkContextNull: function () {
            if ($("#checkUser").val().length == 0) {
                $("#checkUser").addClass("px error-bor");
                this.windowPop("用户账号不能为空！");
                return false;
            } else {
                $("#checkUser").removeClass("px error-bor");
                $("#checkUser").addClass("px");
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
            $("#gzzdBroadbandPage").on("tap", ".close", function (e) {
                that.closeWin(this);
                e.preventDefault();
            });
        },
        closeWin: function (that) {
            $(that).parents(".window").hide();
            $(that).parents(".share_win").hide();
            $(".overlay").hide();
        },
        submitHandler: function () {
            this.item = "";
            this.trStrAD = "";
            this.trStr = "";
            this.infoStr = "";
            var that = this;
            $.ajax({
                url: this.urlStr + "?userType=" + this.userTypeValue + "&gatherId=" + this.gatherIdValue + "&checkUser=" + $("#checkUser").val(),
                type: "post",
                dataType: "json",
                security:false,
                data: {},
                success: function (data, status, xhr) {
                    if (data.code == 1) {
                        if (data.value.length != 0) {
                            if (that.userTypeValue == 10 || that.userTypeValue == 11) {
                                that.trStrAD = that.trStrADStart;
                                if (data.value[data.value.length - 2]["BAS->HJ"] == 1 && data.value[testdata.value.length - 2]["HJ->DSLAM"] == 1) {
                                    that.trStrAD += "<li class='state'><img src='images/iconfont-gou.png' alt=''/></li>" +
                                        "<li><img src='images/iconfont-iconyunfuwuqi_hover.png' alt=''/><p>DSLAM</p></li>" +
                                        "<li class='state'><img src='images/iconfont-gou.png' alt=''/></li>" +
                                        "<li><img src='images/iconfont-pc_hover.png' alt=''/><p>PC</p></li><li class='line'></li></ul>";
                                } else {
                                    that.trStrAD += "<li class='state'><img src='images/iconfont-chahao.png' alt=''/></li>" +
                                        "<li><img src='images/iconfont-iconyunfuwuqi.png' alt=''/><p>DSLAM</p></li>" +
                                        "<li class='state'></li>" +
                                        "<li><img src='images/iconfont-pc.png' alt=''/><p>PC</p></li><li class='line'></li></ul>";
                                }

                                $(".imgDiv").html(that.trStrAD);

                                for (var i = 0; i < data.value.length; i++) {
                                    if (data.value[i]["devType"] == "BAS") {
                                        that.infoStr += "<h4 class='info_title'>BAS信息-基本信息：</h4>" +
                                            "<table class='tab_main tab_info' style='margin-bottom:5px' width='100%' border='0' cellspacing='0' cellpadding='0'>" +
                                            "<tbody><tr><td>设备名称</td><td>" + data.value[i]["bas_device_name"] +
                                            "</td></tr><tr><td>设备IP</td><td>" + data.value[i]["bas_ip"] +
                                            "</td></tr><tr><td>设备类型</td><td>" + data.value[i]["bas_type"] +
                                            "</td></tr><tr><td>设备状态</td><td>" + data.value[i]["bas_vlan_state"] +
                                            "</td></tr><tr><td>下联口管理状态</td><td>" + data.value[i]["bas_port_admin_state"] +
                                            "</td></tr><tr><td>下联口运行状态</td><td>" + data.value[i]["bas_port_oper_state"] +
                                            "</td></tr><tr><td>设备端口描述</td><td>" + data.value[i]["bas_port_index"] +
                                            "</td></tr></tbody></table>";
                                    }
                                    if (data.value[i]["devType"] == "DSLAM") {
                                        that.infoStr += "<h4 class='info_title'>DSLAM信息-基本信息：</h4>" +
                                            "<table class='tab_main tab_info' style='margin-bottom:5px' width='100%' border='0' cellspacing='0' cellpadding='0'>" +
                                            "<tbody><tr><td>设备IP</td><td>" + data.value[i]["dslam_ip"] +
                                            "</td></tr><tr><td>设备型号</td><td>" + data.value[i]["dslam_type"] +
                                            "</td></tr><tr><td>端口编码</td><td>" + data.value[i]["dslam_port_index"] +
                                            "</td></tr><tr><td>设备状态</td><td>" + data.value[i]["dslam_state"] +
                                            "</td></tr><tr><td>端口管理状态</td><td>" + data.value[i]["dslam_port_admin_state"] +
                                            "</td></tr><tr><td>端口运行状态</td><td>" + data.value[i]["dslam_port_oper_state"] +
                                            "</td></tr><tr><td>最大下行速率</td><td>" + data.value[i]["dslam_port_max_downrate"] +
                                            "</td></tr><tr><td>最大上行速率</td><td>" + data.value[i]["dslam_port_max_uprate"] +
                                            "</td></tr></tbody></table>";
                                    }
                                }
                                $(".detailsInfoDiv").html(that.infoStr);

                            } else if (that.userTypeValue == 12) {
                                that.trStr = that.trStrStart;
                                if (data.value[data.value.length - 2]["OLT->ODN"] == 1 && data.value[data.value.length - 2]["ODN->ONU"] == 1) {
                                    that.trStr += "<li class='state'><img src='images/iconfont-gou.png' alt=''/></li>" +
                                        "<li><img src='images/iconfont-iconyunfuwuqi_hover.png' alt=''/><p>OLT</p></li>" +
                                        "<li class='state'><img src='images/iconfont-gou.png' alt=''/></li>" +
                                        "<li><img src='images/iconfont-pc_hover.png' alt=''/><p>PC</p></li><li class='line'></li></ul>";
                                } else {
                                    that.trStr += "<li class='state'><img src='images/iconfont-chahao.png' alt=''/></li>" +
                                        "<li><img src='images/iconfont-iconyunfuwuqi.png' alt=''/><p>ONU</p></li>" +
                                        "<li class='state'></li>" +
                                        "<li><img src='images/iconfont-pc.png' alt=''/><p>PC</p></li><li class='line'></li></ul>";
                                }
                                $(".imgDiv").html(that.trStr);

                                for (var i = 0; i < data.value.length; i++) {
                                    if (data.value[i]["devType"] == "OLT") {
                                        that.infoStr += "<h4 class='info_title'>OLT信息-基本信息：</h4>" +
                                            "<table class='tab_main tab_info' style='margin-bottom:5px' width='100%' border='0' cellspacing='0' cellpadding='0'>" +
                                            "<tbody><tr>" +
                                            "<td>设备名称</td><td>" + data.value[i]["DevName"] +
                                            "</td></tr><tr><td>设备IP</td><td>" + data.value[i]["DevIp"] +
                                            "</td></tr><tr><td>设备型号</td><td>" + data.value[i]["DevModel"] +
                                            "</td></tr><tr><td>端口编码</td><td>" + data.value[i]["PortInfo"] +
                                            "</td></tr><tr><td>设备状态</td><td>" + data.value[i]["DevStat"] +
                                            "</td></tr><tr><td>端口管理状态</td><td>" + data.value[i]["PAdminStat"] +
                                            "</td></tr><tr><td>端口运行状态</td><td>" + data.value[i]["POperStat"] +
                                            "</td></tr><tr><td>发光功率</td><td>" + data.value[i]["SOPower"] +
                                            "</td></tr><tr><td>收光功率</td><td>" + data.value[i]["ROPower"] +
                                            "</td></tr><tr><td>软件版本</td><td>" + data.value[i]["BoardSoftver"] +
                                            "</td></tr><tr><td>SVLAN</td><td>" + data.value[i]["OLTSVlan"] +
                                            "</td></tr></tbody></table>";
                                    }

                                    if (data.value[i]["devType"] == "ONU") {
                                        that.infoStr += "<h4 class='info_title'>ONU信息-基本信息：</h4>" +
                                            "<table class='tab_main tab_info' style='margin-bottom:5px' width='100%' border='0' cellspacing='0' cellpadding='0'>" +
                                            "<tbody><tr>" +
                                            "<td>设备名称</td><td>" + data.value[i]["DevName"] +
                                            "</td></tr><tr><td>设备IP</td><td>" + data.value[i]["DevIp"] +
                                            "</td></tr><tr><td>设备型号</td><td>" + data.value[i]["DevModel"] +
                                            "</td></tr><tr><td>端口编码</td><td>" + data.value[i]["PortInfo"] +
                                            "</td></tr><tr><td>设备状态</td><td>" + data.value[i]["DevStat"] +
                                            "</td></tr><tr><td>上联口管理状态</td><td>" + data.value[i]["UAdminStat"] +
                                            "</td></tr><tr><td>上联口运行状态</td><td>" + data.value[i]["UOperStat"] +
                                            "</td></tr><tr><td>发光功率</td><td>" + data.value[i]["SOPower"] +
                                            "</td></tr><tr><td>收光功率</td><td>" + data.value[i]["ROPower"] +
                                            "</td></tr><tr><td>软件版本</td><td>" + data.value[i]["Onusoftver"] +
                                            "</td></tr><tr><td>硬件版本</td><td>" + data.value[i]["Onuhardver"] +
                                            "</td></tr><tr><td>认证模式</td><td>" + data.value[i]["AuthModel"] +
                                            "</td></tr></tbody></table>";
                                    }
                                }
                                $(".detailsInfoDiv").html(that.infoStr);
                            }

                        } else {
                            if (that.userTypeValue == 10 || that.userTypeValue == 11) {
                                that.trStrAD = that.trStrADNull;
                                $(".imgDiv").html(that.trStrAD);
                                $(".detailsInfoDiv").html(that.ADorLANNullInfo);

                            } else if (that.userTypeValue == 12) {
                                that.trStr = that.trStrNull;
                                $(".imgDiv").html(that.trStr);
                                $(".detailsInfoDiv").html(that.PONNullInfo);
                            }

                            that.windowPop("宽带故障信息获取失败！");
                        }
                    } else {
                        if (that.userTypeValue == 10 || that.userTypeValue == 11) {
                            that.trStrAD = that.trStrADNull;
                            $(".imgDiv").html(that.trStrAD);
                            $(".detailsInfoDiv").html(that.ADorLANNullInfo);

                        } else if (that.userTypeValue == 12) {
                            that.trStr = that.trStrNull;
                            $(".imgDiv").html(that.trStr);
                            $(".detailsInfoDiv").html(that.PONNullInfo);
                        }
                        that.windowPop("宽带故障详情信息获取失败！");
                    }
                    that.loaded();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (that.userTypeValue == 10 || that.userTypeValue == 11) {
                        that.trStrAD = that.trStrADNull;
                        $(".imgDiv").html(that.trStrAD);
                        $(".detailsInfoDiv").html(that.ADorLANNullInfo);

                    } else if (that.userTypeValue == 12) {
                        that.trStr = that.trStrNull;
                        $(".imgDiv").html(that.trStr);
                        $(".detailsInfoDiv").html(that.PONNullInfo);
                    }
                    that.loaded();
                    that.windowPop("宽带故障详情信息获取失败！");
                }
            })
        },
        loaded: function () {
            new IScroll('#gzzdBroadbandPage .content', { bounceEasing: 'circular', bounceTime: 1200 });
        },
        render: function () {
            this.$el.append(this.template());
            return this;
        }
    });

    return View;
});

/**
 * 弹出框选定类型
 */
