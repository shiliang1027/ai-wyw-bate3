/**
 * Created by shiliang on 2016/3/23.
 */
define([
    'underscore',
    'text!refreshiscroll/pulldown.html',
    'text!refreshiscroll/pullup.html',
    'css!refreshiscroll/refreshiscroll.css'
], function(_,pulldowntemp,pulluptemp){
    var RefreshIscroll = function(options){
        this.iscroll = options.iscroll;
        this.$wrapper =  $(this.iscroll.wrapper);
        this.down=options.down?options.down:false;
        this.up=options.up?options.up:false;
        this.downcallback=options.downcallback;
        this.upcallback=options.upcallback;
        this.down?this.$wrapper.children().prepend(_.template(pulldowntemp)):"";
        this.up?this.$wrapper.children().append(_.template(pulluptemp)):"";

        var scrollHeight= this.$wrapper.children().height();
        var subHeight=this.$wrapper.height();
        console.info(scrollHeight+","+subHeight);
        if(scrollHeight<=subHeight){
            this.$wrapper.children().append("<div style='height:"+(subHeight-scrollHeight+10)+"px;'> </div>");
            this.iscroll.refresh();
        }
        this.def_y=40;
        this.upIcon = this.$wrapper.find("#up-icon");
        this.downIcon = this.$wrapper.find("#down-icon");
        var self = this;
        this.iscroll.on("scroll",function(){
            var y = this.y,
                maxY = this.maxScrollY - y,
                downHasClass = self.downIcon.hasClass("reverse_icon"),
                upHasClass = self.upIcon.hasClass("reverse_icon");

            if(y >= self.def_y){
                !downHasClass && self.downIcon.addClass("reverse_icon");
                !downHasClass && self.$wrapper.find("#pullDown-msg").html("释放刷新...");
                return "";
            }else if(y < self.def_y && y > 0){
                downHasClass && self.downIcon.removeClass("reverse_icon");
                downHasClass && self.$wrapper.find("#pullDown-msg").html("下拉刷新...");
                return "";
            }

            if(maxY >= self.def_y){
                !upHasClass && self.upIcon.addClass("reverse_icon");
                return "";
            }else if(maxY < self.def_y && maxY >=0){
//                    upHasClass && upIcon.removeClass("reverse_icon");
                return "";
            }
        });

        this.iscroll.on("slideDown",function(){
            if(this.y > self.def_y && self.down){
//                    upIcon.removeClass("reverse_icon")
//                    $("#scroller-pullDown").css({"top":0})
                if(typeof self.downcallback==='function'){
//                    this.scrollerStyle.top="60px";
//                    setTimeout(function(){
                        self.downcallback.call();
//                    },1000);
                }

            }
        });

        this.iscroll.on("slideUp",function(){
            if(this.maxScrollY - this.y > self.def_y && self.up){
//                    upIcon.removeClass("reverse_icon")
                if(typeof self.upcallback==='function'){
                    self.upcallback.call();
                }
            }
        });
    }

    RefreshIscroll.prototype.stop = function(){
        var downHasClass = this.downIcon.hasClass("reverse_icon"),
            upHasClass = this.upIcon.hasClass("reverse_icon");
        downHasClass && this.downIcon.removeClass("reverse_icon");
        upHasClass && this.upIcon.removeClass("reverse_icon");
    }

    return RefreshIscroll;
});