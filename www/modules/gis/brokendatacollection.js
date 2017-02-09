/**
 * Created by shiliang on 2015/11/28.
 */
define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

    var BrokenDataCollection = Backbone.Collection.extend({
        fetch:function(){
            console.info("fetch...")
            var self=this;
            var jqxhr = $.ajax({
                url: actionInfo.url + actionInfo.ranking,
                type: "post",
                dataType: "json",
                data: {"kid": "41"},
                success: function (data, status, xhr) {
                    self.add(data);
                    self.trigger("fetchCompleted:BrokenData");
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error(textStatus);
                }
            });
        }
    });
    return BrokenDataCollection;
});