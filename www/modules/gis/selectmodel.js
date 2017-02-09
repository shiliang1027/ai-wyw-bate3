/**
 * Created by shiliang on 2016/1/14.
 */
define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    var SelectModel = Backbone.Model.extend({
        s2G: {selected:true,value:16},
        s3G: {selected:true,value:28},
        s4G: {selected:true,value:103},
        d2G: {selected:true,value:16},
        d3G: {selected:true,value:28},
        d4G: {selected:true,value:103},
        initialize: function () {
            var set = sessionStorage.getItem("select_set");
            set = eval("(" + set + ")");
            if (set != null && set != undefined && set != "") {
                this.s2G.selected = set.s2G;
                this.s3G.selected = set.s3G;
                this.s4G.selected = set.s4G;
                this.d2G.selected = set.d2G;
                this.d3G.selected = set.d3G;
                this.d4G.selected = set.d4G;
            }
        }
    });
    return SelectModel;
});