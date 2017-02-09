/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone', 'iscroll','modules/kpi/groupcollection', 'text!modules/kpi/viewTemplate.html','refreshiscroll/refreshiscroll'], function ($, _, Backbone,IScroll,DataCollection, viewTemplate,RefreshIscroll) {
    var View = Backbone.View.extend({
        template: _.template(viewTemplate),
        events: {
            "pageshow":"pageShow",
            "pagehide":"pageHide",
            "tap #leftUL li":"groupclick",
            "tap .gz_btn":"doSubscribe",
            "tap .gz_ico":"undoSubscribe",
            "tap .gz_span":"showKpiDetail"
        },
        initialize: function (options) {
            this.groupDatas = new DataCollection();
            this.groupDatas.bind("fetchCompleted:GroupData", this.build, this);
        },
        pageHide:function(){
            console.info("page hide...")
        },
        pageShow:function(){
            this.groupDatas.fetch();
        },
        groupclick:function(event){
            $("#rightUL li").hide();
            $("#rightUL li[gid='"+$(event.currentTarget).attr("gid")+"']").show();
        },
        render: function () {
            console.info(this.groupDatas.toJSON())
            this.$el.html(this.template({"groupDatas":this.groupDatas.toJSON()}));
            return this;
        },
        build:function(){
            this.render();
            new IScroll('.kpi_list_left', {preventDefault:false, bounceEasing: 'circular', bounceTime: 1200 });
            var self = this;
            var pulldownAction = function () {
                //获取数据
                self.groupDatas.fetch();
            };
            new RefreshIscroll({"iscroll": new IScroll('.kpi_list_right', { preventDefault: false, probeType: 3, bounceEasing: 'circular', bounceTime: 500 }),"down":true,"downcallback":pulldownAction});
        },
        //订阅
        doSubscribe:function(event){
            console.info($(event.currentTarget).parent().attr("kid"));
            var _target = $(event.currentTarget);
            $.ajax({
                url: actionInfo.url + actionInfo.saveSub,
                type: "post",
                dataType: "json",
                data: {"subscribe.s_kid": $(event.currentTarget).parent().attr("kid")},
                success: function (data, status, xhr) {
                    if (data.code == 1) {
                        _target.removeClass("gz_btn").addClass("gz_ico");
                    }
                    else {
                        navigator.notification.alert('订阅失败！', null, '提示', '确定' );
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    navigator.notification.alert('订阅失败！', null, '提示', '确定' );
                }
            })
        },
        //取消订阅
        undoSubscribe:function(event){
            console.info($(event.currentTarget).parent().attr("kid"));
            var _target = $(event.currentTarget);
            $.ajax({
                url: actionInfo.url + actionInfo.deleteSub,
                type: "post",
                dataType: "json",
                data: {"subscribe.s_kid": $(event.currentTarget).parent().attr("kid")},
                success: function (data, status, xhr) {
                    if (data.code == 1) {
                        _target.removeClass("gz_ico").addClass("gz_btn");
                    }
                    else {
                        navigator.notification.alert('取消订阅失败！', null, '提示', '确定' );
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    navigator.notification.alert('取消订阅失败！', null, '提示', '确定' );
                }
            });
        },
        showKpiDetail:function(event){
            var kpiId=$(event.currentTarget).attr("kid");
            var kpiName=$(event.currentTarget).attr("kname");
            var kpiKind=$(event.currentTarget).attr("kind");
            sessionStorage.setItem('detailkpi', JSON.stringify({"kpiId":kpiId,"kpiName":kpiName,"kpiKind":kpiKind}));
            Backbone.trigger("goModule",{"moduleurl":"modules/kpi/kpidetail/kpidetail"});
        }
    });
    return View;
});