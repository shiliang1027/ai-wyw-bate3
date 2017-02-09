/**
 * Created by shiliang on 2015/11/28.
 */
define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

    var DataCollection = Backbone.Collection.extend({
        fetch:function(kpiId,time){
            this.reset();
            console.info("fetch...")
                var self = this;
                var jqxhr = $.ajax({
                    url: actionInfo.url + actionInfo.queryKpiData,
                    type: "post",
                    dataType: "json",
                    data: {"kid": kpiId,"params": time},
                    async: false,
                    success: function (data, status, xhr) {
                        // 成功就有数据
                        if(data&&parseInt(data.code)==1){
                            self.add(data.value);
                            self.trigger("fetchCompleted:KpiDetailDatas");
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                    }
                });
        }
    });
    return DataCollection;
});