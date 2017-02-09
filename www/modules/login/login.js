/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone', 'text!modules/login/loginViewTemplate.html'], function ($, _, Backbone, loginViewTemplate) {
    var LoginView = Backbone.View.extend({
        className: 'login_bg',
        template: _.template(loginViewTemplate),
        events: {
            "pageshow":"pageShow",
            "pagehide":"pageHide",
            "tap #rememberPW": "doRememberPM",
            "tap .nologin" :"nologin",
            "tap .login_btn":"doLogin"
        },
        initialize: function (options) {

        },
        pageHide:function(){
            console.info("page hide...");
        },
        pageShow:function(){
            var userinfo = {};
            try {
                userinfo = JSON.parse(localStorage.userinfo);
            } catch (e) {
				console.error(e);
            }
            if (userinfo.rememberMe == true) {
                $("#userName").val(userinfo.userName);
                $("#userPwd").val(userinfo.userPwd);
                $("#rememberPW").prop("checked", true);
                $('.password_checkbox').toggleClass('on');
            }
        },
        doLogin: function () {
            if(!checkNetWork()){
                return;
            }
            var userName = $.trim($("#userName").val()),
                userPwd = $.trim($("#userPwd").val()),
                rememberMe = $("#rememberPW").prop("checked");
            $.ajax({
                url: actionInfo.url + actionInfo.login,
                type: "post",
                dataType: "json",
                data: $("form#loginform").serialize(),
                success: function (data, status, xhr) {
                    if (data && data.code == 1) {
                        var lastLoginUserName = localStorage.lastLoginUserName;
                        if (!lastLoginUserName) {
                            localStorage.lastLoginUserName = userName;
                        } else if (lastLoginUserName != userName) {
                            localStorage.removeItem('userinfo');
                            localStorage.lastLoginUserName = userName;
                        }
                        // 将登录信息写入本地session
                        if (rememberMe == true) { // 如果点击了记住按钮则记住密码
                            var userinfo = {"userName": userName, "userPwd": userPwd, "rememberMe": rememberMe};
                            localStorage.userinfo = JSON.stringify(userinfo);
                        } else {
                            localStorage.removeItem('userinfo');
                        }
                        //                alert(data.value.name);
//                        $.cookie("jsessionid",data.value.sessionId);
                        sessionStorage.setItem('username', data.value.name);
                        sessionStorage.setItem('usercode', data.value.code);
                        sessionStorage.setItem('userPassword', userPwd);
                        sessionStorage.setItem('token', data.value.token);
                        sessionStorage.setItem('sessionId', data.value.sessionId);
                        sessionStorage.setItem('userMenus', JSON.stringify(data.value.menus));
                        Backbone.trigger("goModule",{"moduleurl":"modules/home/home"});
						testSQLite();
						testIndexDB();
                    }
                    else {
                        navigator.notification.alert(data.detail, null, '提示', '确定');
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    navigator.notification.alert('登录失败，请重新登录或联系管理员！', null, '提示', '确定');
                }
            });
        },
        doRememberPM: function () {
            $('.password_checkbox').toggleClass('on');
        },
        nologin : function()
        {
        	var telURL = "tel:053188688165";
        	window.open(telURL, '_system', 'location=yes');
        },
        render: function () {
            this.$el.append(this.template());
            return this;
        }
    });

    return LoginView;
});