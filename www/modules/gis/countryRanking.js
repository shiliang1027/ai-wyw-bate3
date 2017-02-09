/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone', 'text!modules/gis/countyRankingViewTemplate.html'], function ($, _, Backbone, countyRankingViewTemplate) {
    var CountyRankingView = Backbone.View.extend({
        template: _.template(countyRankingViewTemplate),
        events: {
            "pageshow":"pageShow",
            "pagehide":"pageHide"
        },
        initialize: function (options) {
            this.RankingDatas = new queryCountyRankingCollection();
            this.RankingDatas.bind("fetchCompleted:countryRankingDatas",this.buildList,this);
        },
        pageHide:function(){
            console.info("page hide...")
        },
        pageShow:function(){
            console.info(sessionStorage.getItem("cityId"));
            document.addEventListener('touchmove', function (e) {
                e.preventDefault();
            }, false);

            this.RankingDatas.fetch(sessionStorage.getItem("cityId"));
        },
        buildList : function(){
            var data = this.RankingDatas.toJSON()[0];
            var totalNum = 0;
            var breakNum = 0;
            var width =100;
            if(data.code == 0){
                $.each(data.value,function(index, content){
                    var total=0;
                    var bro =0;
                    if(content.total==undefined){
                        total = 0;
                    }else{
                        total = content.total;
                    }
                    if(content["break"]==undefined){
                        bro  = 0;
                    }else{
                        bro = content["break"];
                    }
                    totalNum+=total;
                    breakNum+=bro;
                });
                $.each(data.value,function(index, content){
                    var str = "";
                    var total=0;
                    var bro =0;
                    var i =  parseInt(index)+1;
                    str +="<ul class=\"ranking_main clearfix\"><li class=\"ranking_num\">";
                    if(i>3){
                        str += "<div class=\"number grey\">"+i+"</div>";
                    }else{
                        str += "<div class=\"number\">"+i+"</div>";
                    }
                    str += "<span>"+content.cityName+"</span>";
                    if(content.total==undefined){
                        total = 0;
                    }else{
                        total = content.total;
                    }
                    if(content["break"]==undefined){
                        bro  = 0;
                    }else{
                        bro = content["break"];
                    }
                    width = bro/breakNum*100;
                    str += "<span>"+total+'/'+bro+"</span>";
                    str += " </li><li class=\"ranking_total\"><div class=\"ranking_total_col\" style=\"width:"+width+"%;\"></div></li></ul>";
                    $(".ranking_content div[class=clearfix]").append(str);
                })
                $("#totalNum").html(totalNum);
                $("#breakNum").html(breakNum);
            }else{
//                windowPop(data.value[0]['deviceSerialNumber']);
                $("#totalNum").html(totalNum);
                $("#breakNum").html(breakNum);

                windowPop("查询失败！");
//                navigator.notification.alert('查询失败！', null, '提示', '确定' );
            }
            new IScroll('#countyranking .testing_content', {
                bounceEasing: 'circular',
                bounceTime: 1200,
                scrollbars: true // 显示滚动条
            });
        },
        render: function () {
            this.$el.append(this.template());
            return this;
        }
    });

    var sessionId = sessionStorage.getItem('sessionId');
    var queryCountyRankingCollection = Backbone.Collection.extend({
        fetch:function(cityId){
            console.info("fetch...")
            var self=this;
            var jqcr = $.ajax({
                url: actionInfo.url + actionInfo.countryRanking,
                type: "post",
                dataType: "json",
                data: {"jsessionid" :sessionId,
                    "userInfoType":"1",
                    "cityId": cityId},

                success: function (data, status, xhr) {
                    self.add(data);
                    self.trigger("fetchCompleted:countryRankingDatas");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $("#totalNum").html(0);
                    $("#breakNum").html(0);

                    windowPop("查询失败！");
//            navigator.notification.alert('查询失败！', null, '提示', '确定' );
                    new IScroll('#countyranking .testing_content', {
                        bounceEasing: 'circular',
                        bounceTime: 1200,
                        scrollbars: true // 显示滚动条
                    });
                }
            })
        }
    });
    return CountyRankingView;
});
