/**
 * Created by shiliang on 2015/11/28.
 */
define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

    var DataCollection = Backbone.Collection.extend({
        fetch:function(){
            console.info("fetch...")
            var self=this;
            var jqxhr = $.ajax({
                url: actionInfo.url + actionInfo.getGroup,
                type: "post",
                dataType: "json",
                data: {"webAppGroup.kind": "1"},
                success: function (data, status, xhr) {
                    if(parseInt(data.code)==1){
                        self.add(data.value);
                        self.trigger("fetchCompleted:GroupData");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(textStatus);
                }
            });
        }
    });
    return DataCollection;
});