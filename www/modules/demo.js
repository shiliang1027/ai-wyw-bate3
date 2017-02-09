/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone','iscroll', 'text!modules/dome/viewTemplate.html'], function ($, _, Backbone,IScroll, viewTemplate) {
    var View = Backbone.View.extend({
        template: _.template(viewTemplate),
        events: {
            "pageshow":"pageShow",
            "pagehide":"pageHide"
        },
        initialize: function (options) {

        },
        pageHide:function(){
            console.info("page hide...")
        },
        pageShow:function(){
        },
        render: function () {
            this.$el.append(this.template());
            return this;
        }
    });

    return View;
});