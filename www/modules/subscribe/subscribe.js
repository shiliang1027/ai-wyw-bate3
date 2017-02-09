/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone', 'iscroll','modules/subscribe/datacollection', 'text!modules/subscribe/viewTemplate.html','refreshiscroll/refreshiscroll'], function ($, _, Backbone,IScroll,DataCollection, viewTemplate,RefreshIscroll) {
    var View = Backbone.View.extend({
        template: _.template(viewTemplate),
        events: {
            "pageshow":"pageShow",
            "pagehide":"pageHide",
            "click .edit_btn":"edit",
            "click .com_btn":"editComplete",
            "click .del_btn":"del",
            "click .sub_total,.sub_detail":"showKpiDetail"
        },
        initialize: function (options) {
            this.subscribeDatas = new DataCollection();
            this.subscribeDatas.bind("fetchCompleted:SubscribeData", this.build, this);
        },
        pageHide:function(){
            console.info("page hide...")
        },
        pageShow:function(){
            this.subscribeDatas.fetch();
        },
        build:function(){
            this.render();
            var self = this;

            var pulldownAction = function () {
                //获取数据
                self.subscribeDatas.fetch();
            };
            new RefreshIscroll({"iscroll": new IScroll('#sub', { preventDefault: false, probeType: 3, bounceEasing: 'circular', bounceTime: 500 }),"down":true,"downcallback":pulldownAction});
//            new IScroll('#sub', {preventDefault:false, bounceEasing: 'circular', bounceTime: 1200 });
        },
        render: function () {
            console.info(this.subscribeDatas.toJSON());
            this.$el.html(this.template({"subscribeDatas":this.subscribeDatas.toJSON()}));
            return this;
        },
        edit:function(){
            $(".edit_btn").css("display", "none");
            $(".com_btn").css("display", "block");
            $(".del_btn").css("display", "block");
        },
        editComplete:function(){
            $(".edit_btn").css("display", "block");
            $(".com_btn").css("display", "none");
            $(".del_btn").css("display", "none");
        },
        del:function(event){
            console.info("----")
            var kpiId=$(event.target).attr("kid");
            var _this=$(event.target);
            console.info(kpiId)
            $.ajax({
                url: actionInfo.url + actionInfo.deleteSub,
                type: "post",
                dataType: "json",
                data: {"subscribe.s_kid": kpiId},
                success: function (data, status, xhr) {
                    if (data.code == 1) {
                        _this.parent().remove();
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