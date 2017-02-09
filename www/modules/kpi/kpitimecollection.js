/**
 * Created by shiliang on 2015/11/28.
 */
define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

    var DataCollection = Backbone.Collection.extend({
        fetch:function(){
            console.info("fetch...")
            this.reset();
            var _data;
            if(!$.isEmptyObject(sessionStorage.getItem("kipTimeList"))){
                _data =  JSON.parse(sessionStorage.getItem("kipTimeList"));
                this.add(_data);
                this.trigger("fetchCompleted:KpiTimeDatas");
            }else {
                var self = this;
                var jqxhr = $.ajax({
                    url: actionInfo.url + actionInfo.getTimeList,
                    type: "post",
                    dataType: "json",
                    data: {},
                    success: function (data, status, xhr) {
                        if (data.code == 1) {
                            sessionStorage.setItem("kipTimeList", JSON.stringify(data.value));
                            self.add(data.value);
                            self.trigger("fetchCompleted:KpiTimeDatas");
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                    }
                });
            }
        }
    });
    return DataCollection;
});