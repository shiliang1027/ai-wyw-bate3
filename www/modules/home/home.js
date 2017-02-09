/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone', 'iscroll', 'modules/kpi/kpichartutil', 'modules/home/kpidatacollection', 'text!modules/home/homeViewTemplate.html', 'refreshiscroll/refreshiscroll'], function ($, _, Backbone, IScroll, KpiChartUtil, KpiDataCollection, homeViewTemplate, RefreshIscroll) {
    var HomeView = Backbone.View.extend({
        template: _.template(homeViewTemplate, {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g
        }),
        events: {
            "pageshow": "pageShow",
            "pagehide": "pageHide",
            "click #up":"upScroll",
            "click #down":"downScroll"
        },
        initialize: function (options) {
            this.menus = JSON.parse(sessionStorage.getItem("userMenus"));
            this.kpisData = new KpiDataCollection();
            this.kpisData.bind("fetchCompleted:KpiDatas", this.buildCharts, this);
            this.charts = [];
            this.currentIndex=0;
        },
        pageHide: function () {
            console.info("page hide...");
            KpiChartUtil.clear("chartDiv0,chartDiv1,chartDiv2,chartDiv3");
        },
        pageShow: function () {
            var self = this;
			var pulldownAction = function () {
		        //获取数据
                self.kpisData.fetch();
		    };
            new RefreshIscroll({"iscroll": new IScroll('#home_content', { preventDefault: false, probeType: 3, bounceEasing: 'circular', bounceTime: 500 }),"down":true,"downcallback":pulldownAction});

//            new IScroll('#wrapper', {
//                scrollX: true,
//                scrollY: false,
//                momentum: false,
//                snap: true,
//                snapSpeed: 1,
//                keyBindings: true,
//                indicators: {
//                    el: document.getElementById('indicator'),
//                    resize: false
//                }
//            });

//            setTimeout(function(){
            self.kpisData.fetch();
//            },50);
        },

        render: function () {
            this.$el.html(this.template({menus: this.menus}));
            return this;
        },
        upScroll:function(){
            if((0<this.currentIndex)&&(this.currentIndex<=3)){
                $("#down").attr("src","images/ico_right1.png");
                $("#chartDiv"+this.currentIndex).css({left:"100%"});
                this.currentIndex--;
                $("#chartDiv"+this.currentIndex).css({left:0});
            }
            if(this.currentIndex==0){
                $("#up").attr("src","images/ico_left2.png");
            }


        },
        downScroll:function(){
            if((0<=this.currentIndex)&&(this.currentIndex<3)){
                $("#up").attr("src","images/ico_left1.png");
                $("#chartDiv"+this.currentIndex).css({left:"100%"});
                this.currentIndex++;
                $("#chartDiv"+this.currentIndex).css({left:0});
            }
            if(this.currentIndex==3){
                $("#down").attr("src","images/ico_right2.png");

            }

        },
        buildCharts: function () {
            var self = this;
            console.info(this.kpisData.toJSON());
            $.each(this.kpisData.toJSON(), function (i, val) {
                val.dataMap ? val.dataMap.kind = val.kind : "";
                // "宽带工单成功率" 统计图不同
                val.id == 5 ?
                    KpiChartUtil.buildChartKpi5("chartDiv" + i,
                        val.dataMap, "echarts/build/dist",
                            (!val.dataMap || !val.dataMap.st ? "" : val.dataMap.st.substring(0, 10))
                            + " " + val.name)
                    :
                    KpiChartUtil.buildChart("chartDiv" + i,
                        val.dataMap, "echarts/build/dist",
                            (!val.dataMap || !val.dataMap.st ? "" : val.dataMap.st.substring(0, 10))
                            + " " + val.name);
            });
        }
    });
    return HomeView;
});