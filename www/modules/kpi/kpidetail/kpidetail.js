/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone','iscroll','modules/kpi/kpichartutil','modules/kpi/kpitimecollection','modules/kpi/kpidetailcollection', 'text!modules/kpi/kpidetail/viewTemplate.html'], function ($, _, Backbone,IScroll,KpiChartUtil,KpiTimeDataCollection,KpiDetailDataCollection, viewTemplate) {
    var View = Backbone.View.extend({
        template: _.template(viewTemplate),
        events: {
            "pageshow":"pageShow",
            "pagehide":"pageHide",
            "click #dateView":"showDate",
            "click #weekView":"showWeek",
            "click #monthView":"showMonth",
            "click .view_tab_content ul":"showKpiByTime"
        },
        initialize: function (options) {
            this.timeType=1;
            this.kpi =  JSON.parse(sessionStorage.getItem("detailkpi"));
            console.info(this.kpi)
            this.kpiTimeDatas = new KpiTimeDataCollection();
            this.kpiDetailDatas = new KpiDetailDataCollection();
            this.kpiTimeDatas.bind("fetchCompleted:KpiTimeDatas", this.kpiTimeHandler, this);
            this.kpiDetailDatas.bind("fetchCompleted:KpiDetailDatas", this.kpiDetailHandler, this);
            this.charts=[];
        },
        pageHide:function(){
            console.info("page hide...")
            KpiChartUtil.clear("kpiDayLineDiv");
        },
        pageShow:function(){
            $(".top_info").html(this.kpi.kpiName);
            this.kpiTimeDatas.fetch();
        },
        render: function () {
            this.$el.html(this.template({"timeType":this.timeType,"queryTime":this.queryTime,"kpi":this.kpi,"kpiTimeDatas":this.kpiTimeDatas.toJSON(),"kpiDetailDatas":this.kpiDetailDatas.toJSON()}));
            return this;
        },
        showDate:function(){
            this.timeType=1;
            this.queryTime=this.kpiTimeDatas.toJSON()[0].date.now;
            this.kpiTimeDatas.fetch();
        },
        showWeek:function(){
            this.timeType=2;
            this.queryTime=this.kpiTimeDatas.toJSON()[0].week.now;
            this.kpiTimeDatas.fetch();
        },
        showMonth:function(){
            this.timeType=3;
            this.queryTime=this.kpiTimeDatas.toJSON()[0].month.now;
            this.kpiTimeDatas.fetch();

        },
        showKpiByTime: function (event) {
            this.queryTime=$(event.currentTarget).attr("t");
            console.info(this.queryTime);
            this.kpiTimeDatas.fetch();
        },
        kpiTimeHandler: function () {
            console.info(this.kpiTimeDatas.toJSON());
            if(!this.queryTime){
                switch(this.timeType){
                    case 1:
                        this.queryTime=this.kpiTimeDatas.toJSON()[0].date.now;
                        break;
                    case 2:
                        this.queryTime=this.kpiTimeDatas.toJSON()[0].week.now;
                        break;
                    case 3:
                        this.queryTime=this.kpiTimeDatas.toJSON()[0].month.now;
                        break;
                }
            }
            this.kpiDetailDatas.fetch(this.kpi.kpiId,"timeType="+this.timeType+",time=" +this.queryTime );
        },
        kpiDetailHandler:function(){
            this.render();
            var self = this;
            setTimeout(function(){
            try {
                var retObj = self.kpiDetailDatas.toJSON()[0];
                console.info(retObj)
                retObj.kind = self.kpi.kpiKind;
                self.kpi.kpiId == 5 ?
                    KpiChartUtil.buildChartKpi5("kpiDayLineDiv",
                        retObj, "echarts/build/dist",
                            (!retObj.st ? "" : retObj.st.substring(0,10)) + " " + self.kpi.kpiName)
                    : KpiChartUtil.buildChart("kpiDayLineDiv",
                    retObj, "echarts/build/dist",
                        (!retObj.st ? "" : retObj.st.substring(0,10)) + " " + self.kpi.kpiName);
            }
            catch(e) {
                console.error(e)
            }
            new IScroll('#kpidetaillist_content', { bounceEasing: 'circular', bounceTime: 1200 });
            },200);
        }
    });

    return View;
});