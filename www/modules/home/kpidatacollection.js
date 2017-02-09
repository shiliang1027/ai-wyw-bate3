/**
 * Created by shiliang on 2015/11/28.
 */
/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

    var KpiDataCollection = Backbone.Collection.extend({
        fetch:function(){
            console.info("fetch...");
            console.info();
//            var _data;
//            if(!$.isEmptyObject(sessionStorage.getItem("homekpidata"))){
//                _data =  JSON.parse(sessionStorage.getItem("homekpidata"));
//                this.add(_data);
//                this.trigger("fetchCompleted:KpiDatas");
//            }else{
                var self=this;
                var jqxhr = $.ajax({
                    url: actionInfo.url + actionInfo.queryKpisData,
                    type: "post",
                    dataType: "json",
                    data: {"kids": "1,5,6,7"},
                    success: function (data, status, xhr) {
                        console.info(data);
                        self.reset();
                        if(parseInt(data.code)==1){
//                            sessionStorage.setItem('homekpidata', JSON.stringify(data.value));
                            self.add(data.value);
                            self.trigger("fetchCompleted:KpiDatas");
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        console.error(textStatus);
                    }
                });
//            }
        }
    });
    return KpiDataCollection;
});