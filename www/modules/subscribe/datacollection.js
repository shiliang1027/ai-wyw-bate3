/**
 * Created by shiliang on 2015/11/28.
 */
define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

    var DataCollection = Backbone.Collection.extend({
        fetch:function(){
            console.info("fetch...")
            var self=this;
            var jqxhr = $.ajax({
                url: actionInfo.url + actionInfo.getSubscribeKpis,
                type: "post",
                dataType: "json",
                data: {},
                success: function (data, status, xhr) {
                    self.reset();
                    if(parseInt(data.code)==1){
                        self.add(data.value);
                        self.trigger("fetchCompleted:SubscribeData");
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    new WinBox({
                    	container:self.el,
						html: "<ul>请求数据异常！</ul>",
						title:'提示'
					});
                }
            });
        }
    });
    return DataCollection;
});