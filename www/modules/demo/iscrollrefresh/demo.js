/**
 * Created by shiliang on 2015/11/26.
 */
define(['jquery', 'underscore', 'backbone','iscroll', 'text!modules/demo/iscrollrefresh/viewTemplate.html','css!modules/demo/iscrollrefresh/iscroll.css'], function ($, _, Backbone,IScroll, viewTemplate) {
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
            var myScroll,
                upIcon = $("#up-icon"),
                downIcon = $("#down-icon");

            myScroll = new IScroll('#wrapper', { probeType: 3, mouseWheel: true });

            myScroll.on("scroll",function(){
                var y = this.y,
                    maxY = this.maxScrollY - y,
                    downHasClass = downIcon.hasClass("reverse_icon"),
                    upHasClass = upIcon.hasClass("reverse_icon");

                if(y >= 40){
                    !downHasClass && downIcon.addClass("reverse_icon");
                    return "";
                }else if(y < 40 && y > 0){
                    downHasClass && downIcon.removeClass("reverse_icon");
                    return "";
                }

                if(maxY >= 40){
                    !upHasClass && upIcon.addClass("reverse_icon");
                    return "";
                }else if(maxY < 40 && maxY >=0){
                    upHasClass && upIcon.removeClass("reverse_icon");
                    return "";
                }
            });

            myScroll.on("slideDown",function(){
                if(this.y > 40){
                    console.info("slideDown");
                    upIcon.removeClass("reverse_icon")
                }
            });

            myScroll.on("slideUp",function(){
                if(this.maxScrollY - this.y > 40){
                    console.info("slideUp");
                    upIcon.removeClass("reverse_icon")
                }
            });
        },
        render: function () {
            this.$el.append(this.template());
            return this;
        }
    });

    return View;
});