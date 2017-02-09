/**
 * Created by shiliang on 2015/11/28.
 */
/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone','bmap', 'modules/gis/brokendatacollection', 'text!modules/gis/gisOneViewTemplate.html', 'text!modules/gis/gisMapOption.json'], function ($, _, Backbone,BMap, BrokenDataCollection, gisViewTemplate,gisMapOption) {
    var GisOneView = Backbone.View.extend({
        template: _.template(gisViewTemplate),
        events: {
            "pageshow":"pageShow",
            "pagehide":"pageHide"
        },
        initialize: function (options) {
            this.brokenDatas = new BrokenDataCollection();
            this.brokenDatas.bind("fetchCompleted:BrokenData", this.refreshCharts, this);
            this.charts=[];
            this.gisMapChart=null;
            this.gisMapOtion = JSON.parse(gisMapOption);
        },
        pageShow: function () {
            this.buildCharts();
            this.brokenDatas.fetch();
//            var that = this;
//            setTimeout(function(){that.brokenDatas.fetch();},200);
        },
        pageHide:function(){
            console.info("page hide...");
            if(this.gisMapChart){
                this.gisMapChart.clear();
                this.gisMapChart.dispose();
                this.gisMapChart=null;
            }
        },
        buildCharts: function () {
            var self = this;
            require(
                [
                    'echarts','echarts/chart/map'
                ],
                function (ec) {
                    self.gisMapChart = ec.init(document.getElementById("chartDiv"));
                    self.gisMapChart.setOption(self.gisMapOtion);
                    self.gisMapChart.on('click',self.eConsole);
                });
        },
        refreshCharts:function(){
            if(this.brokenDatas.toJSON().length<=0){
                return;
            }
           var data = this.getMapData(this.brokenDatas.toJSON()[0].value);
           // this.gisMapOtion.series[0].data=data;
           this.gisMapOtion.series[0].markPoint.data=this.makePointColor(data);

            this.gisMapChart.setOption(this.gisMapOtion,true);
        },
        makePointColor:function(data){
            for(var i=0;i<data.length;i++){
                var value=data[i].value;
                if(value<=10){
                    data[i].itemStyle={
                        "normal": {
                            "color": "#0db200"
                        }
                    };
                }else if(value<=50){
                    data[i].itemStyle={
                        "normal": {
                            "color": "#ff9900"
                        }
                    };
                }else{
                    data[i].itemStyle={
                        "normal": {
                            "color": "#D60000"
                        }
                    };
                }
            }
            return data;
        } ,
        getMapData: function (obj) {
            var data = [];
            var retObj = {};
            $.each(obj, function (i, val) {
                if (val.cityName) {
                    var k = {"name": val.cityName+'市', "value": parseInt(val["break"])};
                    data.push(k);
                }
            });
            retObj.data = data;
            return data;
        },
        eConsole: function (param) {
            console.info(param);
            sessionStorage.setItem("choseRegion", param.name.substring(0, param.name.length - 1));
            Backbone.trigger("goModule",{"moduleurl":"modules/gis/gistwo"});
        },
        render: function () {
            this.$el.html(this.template());
            return this;
        }
    });

    return GisOneView;
});